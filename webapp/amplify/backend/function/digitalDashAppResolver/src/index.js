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
  },
}

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { typeName, fieldName, arguments } = event;

  const response = functions[typeName][fieldName]({
    resources: {
      ddbClient,
      envVars: {
        env: process.env.ENV,
        appsync_api_id: process.env.APPSYNC_API_ID,
      }
    },
    arguments,
  });

  return response;
};

