const axios = require("axios");
const AWS = require('aws-sdk');

async function fetchAnalyticsForTiktokProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;

    const lambda = new AWS.Lambda({ region: 'us-west-2' });
    
    console.log('getting videos')
    const getContentResponse = await lambda.invoke({
        FunctionName: 'web-scraper-service-staging-scrapeContent',
        Payload: JSON.stringify({
            platform: 'tiktok',
            handle: profile.profileName,
            task: 'full_run',
            // If this is the first time we're gathering content for the user, use the proxy to get full content. Otherwise, use tor
            use_tor: Boolean(profile.postsLastPopulated) 
        }),
    }).promise();
    const videos = JSON.parse(getContentResponse.Payload)

    console.log(videos);

    if (!Array.isArray(videos)) {
        console.error('Failed to get videos')
        return;
    }

    const items = await Promise.all(videos.map(async (video) => {
        try {
            console.log(`getting ${video.id}`)
            const singleContentResponse = await lambda.invoke({
                FunctionName: 'web-scraper-service-staging-scrapeContent',
                Payload: JSON.stringify({
                    platform: 'tiktok',
                    handle: profile.profileName,
                    task: 'process_single_content',
                    content_to_process: video.id,
                    use_tor: true,
                }),
            }).promise();
    
            const extraInfo = JSON.parse(singleContentResponse.Payload);
            if (extraInfo.errorMessage) {
                return null
            }
    
            const now = new Date().toISOString();
            const viewCount = parseInt(video.views || 0);
            const commentCount = parseInt(extraInfo.comments || 0);
            const likeCount = parseInt(extraInfo.likes || 0);
            const shareCount = parseInt(extraInfo.shares || 0);
            const engagementCount = commentCount + likeCount + shareCount;

            const item = {
                id: video.id,
                profileName: profile.profileName,
                caption: video.caption || '',
                media: [{
                    thumbnailUrl: video.thumbnail_url || '',
                    type: 'video',
                }],
                viewCount,
                commentCount,
                likeCount,
                link: `https://www.tiktok.com/@${profile.profileName}/video/${video.id}`,
                engagementCount,
                shareCount,
                engagementRate: viewCount > 0 ? engagementCount / parseFloat(viewCount) : null,
                datePosted: extraInfo.date || now.toISOString(),
                createdAt: now,
                updatedAt: now,
                __typename: 'TiktokPost',
            };
    
            if (!debug_noUploadToDDB) {
                await ddbClient.put({
                    TableName: 'TiktokPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                    Item: item
                }).promise();
            } else {
                console.log(item)
            }
        } catch (err) {
            console.error(`Failed to get analytics for tiktok ${video.id}`, err)
        }
    }));
}

module.exports = fetchAnalyticsForTiktokProfile;