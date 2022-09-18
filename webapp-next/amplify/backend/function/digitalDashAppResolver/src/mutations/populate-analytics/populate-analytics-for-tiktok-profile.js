const axios = require("axios");
const AWS = require('aws-sdk');

async function fetchAnalyticsForTiktokProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;

    const lambda = new AWS.Lambda({ region: 'us-west-2' });
    
    const getContentResponse = await lambda.invoke({
        FunctionName: 'web-scraper-service-staging-scrapeContent',
        Payload: JSON.stringify({
            platform: 'tiktok',
            handle: profile.profileName,
            task: 'get_content',
        }),
    }).promise();
    const videoIds = JSON.parse(getContentResponse.Payload)

    console.log(getContentResponse)
    console.log(videoIds);

    const items = await Promise.all(videoIds.slice(0,10).map(async (id) => {
        const singleContentResponse = await lambda.invoke({
            FunctionName: 'web-scraper-service-staging-scrapeContent',
            Payload: JSON.stringify({
                platform: 'tiktok',
                handle: profile.profileName,
                task: 'process_single_content',
                content_to_process: id,
            }),
        }).promise();

        console.log(singleContentResponse)
        const video = JSON.parse(singleContentResponse.Payload);
        if (video.errorMessage) {
            return null
        }

        const now = new Date().toISOString();
        const item = {
            id: id,
            profileName: profile.profileName,
            caption: video.caption || '',
            media: [{
                thumbnailUrl: video.thumbnail_url || '',
                type: 'video',
            }],
            viewCount: parseInt(video.views || 0),
            commentCount: parseInt(video.comments || 0),
            likeCount: parseInt(video.likes || 0),
            link: `https://www.tiktok.com/@${profile.profileName}/video/${id}`,
            engagementCount: parseInt(video.comments || 0) + parseInt(video.likes || 0) + parseInt(video.shares || 0),
            shareCount: parseInt(video.shares || 0),
            datePosted: video.date || now.toISOString,
            createdAt: now,
            updatedAt: now,
            __typename: 'TiktokPost',
        };

        if (!debug_noUploadToDDB) {
            await ddbClient.put({
                TableName: 'TiktokPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Item: item
            }).promise();
        }

        return item;
    }));

    return items.filter(item => (item !== null));
}

module.exports = fetchAnalyticsForTiktokProfile;