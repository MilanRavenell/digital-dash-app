const AWS = require('aws-sdk');
const ddbClient = new AWS.DynamoDB.DocumentClient();

const { promises: fs } = require('fs');
const { parse } = require('csv-parse/sync');

const {
  getData,
  findInstagramProfiles,
} = require('./queries');

const {
  fetchAnalytics,
} = require('./mutations');


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const functions = {
  Query: {
    getData,
    findProfiles: async (ctx) => {
      const { platform } = ctx.arguments.input;
      switch (platform) {
        case 'instagram':
          return findInstagramProfiles(ctx);
        default:
          console.error(`platform ${platform} is not supported`);
          return {
            success: false,
            profiles: [],
          };
      }
    },
  },
  Mutation: {
    fetchAnalytics,
    testPopulateTwitterPosts: async () => {
      const csvData = await fs.readFile('/Users/milanravenell/Documents/digital_dash/backend/data/twitter/MillyTheYounger.csv', 'utf8');
      const data = parse(csvData, {columns: true, trim: true});

      await Promise.all(data.map(async ({
        id,
        date,
        title,
        views,
        engagements,
        Profileclicks,
        Likes,
        Detailexpands,
        Mediaengagements,
        Replies,
      }) => {
        const now = new Date().toISOString();
        try {
          await ddbClient.put({
            TableName : 'TwitterPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Item: {
              id,
              profileName: 'MillyTheYounger',
              datePosted: date,
              caption: title,
              viewCount: views || 0,
              engagementCount: engagements || 0,
              profileClickCount: Profileclicks || 0,
              likeCount: Likes || 0,
              detailExpandCount: Detailexpands || 0,
              mediaEngagementCount: Mediaengagements || 0,
              replyCount: Replies || 0,
              createdAt: now,
              updatedAt: now,
              __typename: 'TwitterPost',
              link: `https://twitter.com/MillyTheYounger/status/${id}`
            }
          }).promise();
        } catch (err) {
          console.error(`Failed to add twitter post ${id}`, err)
        }
      }))
    },
    testPopulateYoutubePosts: async () => {
      const csvData = await fs.readFile('/Users/milanravenell/Documents/digital_dash/backend/data/Youtube/UpandAtom.csv', 'utf8');
      const data = parse(csvData, {columns: true, trim: true});

      await Promise.all(data.map(async ({
        id,
        date,
        title,
        views,
        engagements,
        comments,
      }) => {
        const now = new Date().toISOString();
        try {
          await ddbClient.put({
            TableName : 'YoutubePost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Item: {
              id,
              profileName: 'UpandAtom',
              datePosted: date,
              caption: title,
              viewCount: views,
              engagementCount: parseInt(engagements) + parseInt(comments),
              likeCount: engagements,
              commentCount: comments,
              createdAt: now,
              updatedAt: now,
              link: `https://youtube.com${id}`,
              __typename: 'YoutubePost'
            }
          }).promise();
        } catch (err) {
          console.error(`Failed to add youtube post ${id}`, err)
        }
      }))
    }
  },
}

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { typeName, fieldName, arguments } = event;

  const response = functions[typeName][fieldName]({
    resources: {
      ddbClient
    },
    arguments,
  });

  return response;
};

