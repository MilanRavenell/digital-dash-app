const axios = require("axios");
const AWS = require('aws-sdk');
const { makeApiRequest } = require('../../shared');

async function fetchAnalyticsForIgBasicProfile(ctx, profile) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id, WEB_SCRAPER_LAMBDA_NAME: webScraperLambdaName } = envVars;
    const { debug_noUploadToDDB } = ctx.arguments.input;
    const lambda = new AWS.Lambda({ region: 'us-west-2' });

    // get all DDB posts
    const ddbPosts = await getCollectedPosts(ctx, profile);

    if (ddbPosts === null) {
        return;
    }

    const ddbPostIdsSet = new Set(ddbPosts.map(({ id }) => id));

    console.log('scrapping')
    const getContentResponse = await lambda.invoke({
        FunctionName: webScraperLambdaName,
        Payload: JSON.stringify({
            platform: 'instagram',
            handle: profile.profileName,
            task: 'full_run',
            use_tor: false
        }),
    }).promise();
    const scrapedMediaObjects = JSON.parse(getContentResponse.Payload)

    if (!Array.isArray(scrapedMediaObjects)) {
        console.error('Failed to get videos')
        return;
    }

    // Coalesce and format posts from scraper and from DDB
    const mediaObjects = [
        ...scrapedMediaObjects
            .filter(({ shortcode }) => !ddbPostIdsSet.has(shortcode))
            .map(post => ({
                ...post,
                timestamp: new Date(post.taken_at_timestamp * 1000),
            })),
        ...ddbPosts.map(post =>{
            const scrapedMediaObject = scrapedMediaObjects.find(({ shortcode }) => shortcode === post.id);

            return {
                ...post,
                views: post.viewCount,
                shortcode: post.id,
                ...(scrapedMediaObject || {}),
            }
        }),
    ]

    const items = await Promise.all(mediaObjects.map(async (mediaObject) => {
        // TODO: Process single content page for for items not retrieved in full run
        try {
            const media = (!mediaObject.media_info) ? mediaObject.media : mediaObject.media_info.map((media_info) => ({
                type: (media_info.media_type === 'GraphImage') ? 'image' : 'video',
                // instagram-basic pic links cannot be accessed by the DOM, need to fetch image through the backend
                thumbnailUrl: `/api/fetch-image?url=${media_info.thumbnail_url.replace(/&/g, '@@@@')}`,
            }));

            const now = new Date().toISOString();
            const viewCount = mediaObject.views ? parseInt(mediaObject.views) : null;
            const commentCount = parseInt(mediaObject.comments || 0);
            const likeCount = parseInt(mediaObject.likes || 0);
            const engagementCount = commentCount + likeCount;

            const item = {
                __typename: 'InstagramPost',
                id: mediaObject.shortcode,
                profileName: profile.profileName,
                caption: mediaObject.caption || '',
                media,
                commentCount,
                likeCount,
                link: `https://instagram.com/p/${mediaObject.shortcode}/`,
                engagementCount,
                viewCount,
                engagementRate: viewCount ? engagementCount/viewCount : null,
                datePosted: mediaObject.timestamp || now,
                updatedAt: now,
                createdAt: mediaObject.createdAt || now,
            };
    
            if (!debug_noUploadToDDB) {
                await ddbClient.put({
                    TableName: `InstagramPost-${appsync_api_id}-${env}`,
                    Item: item
                }).promise();
            } else {
                console.log(item)
            }
        } catch (err) {
            console.error(`Failed to get analytics for instagram media object ${mediaObject.id}`, err)
        }
    }));
}

async function getCollectedPosts(ctx, profile) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    // TODO: add pagination
    try {
        return (await ddbClient.query({
            TableName: `InstagramPost-${appsync_api_id}-${env}`,
            IndexName: 'ByProfileName',
            KeyConditionExpression: '#profileName = :profileName',
            ExpressionAttributeValues: {
                ':profileName': profile.profileName,
            },
            ExpressionAttributeNames: {
                '#profileName': 'profileName',
            },
            ScanIndexForward: false,
        }).promise())
            .Items;
    } catch (err) {
        console.error(`Failed to fetch collected posts for profile ${profile.profileName}`, err);
        return null;
    }
}

module.exports = fetchAnalyticsForIgBasicProfile;