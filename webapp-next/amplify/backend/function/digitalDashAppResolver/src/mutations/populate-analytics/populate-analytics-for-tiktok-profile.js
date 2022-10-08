const axios = require("axios");
const AWS = require('aws-sdk');

async function fetchAnalyticsForTiktokProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;
    const lambda = new AWS.Lambda({ region: 'us-west-2' });

    // get all DDB posts
    const ddbPosts = await getCollectedPosts(ctx, profile);

    if (ddbPosts === null) {
        return;
    }

    const ddbPostIdsSet = new Set(ddbPosts.map(({ id }) => id));
    
    // get scraped videos
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
    const scrapedVideos = JSON.parse(getContentResponse.Payload)

    if (!Array.isArray(scrapedVideos)) {
        console.error('Failed to get videos')
        return;
    }

    const allVideos = [
        ...ddbPosts.map((post) =>{
            const scrapedVideo = scrapedVideos.find(({ id }) => id === post.id);

            return {
                ...post,
                views: post.viewCount,
                thumbnail_url: post.media[0].thumbnailUrl,
                ...(scrapedVideo || {}),
            }
        }),
        ...scrapedVideos.filter(({ id }) => !ddbPostIdsSet.has(id)),
    ]

    const items = await Promise.all(allVideos.map(async (video) => {
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
                __typename: 'TiktokPost',
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
                updatedAt: now,
                ...(!ddbPostIdsSet.has(video.id) ? { 
                    datePosted: (extraInfo.date || now),
                    createdAt: now,
                } : {}),
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

async function getCollectedPosts(ctx, profile) {
    const { ddbClient } = ctx.resources;

    try {
        return (await ddbClient.query({
            TableName: `TiktokPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging`,
            IndexName: 'ByProfileName',
            KeyConditionExpression: '#profileName = :profileName',
            ExpressionAttributeValues: {
                ':profileName': profile.profileName,
            },
            ExpressionAttributeNames: {
                '#profileName': 'profileName',
            }
        }).promise())
            .Items;
    } catch (err) {
        console.error(`Failed to fetch collected posts for profile ${profile.profileName}`, err);
        return null;
    }
   
}

module.exports = fetchAnalyticsForTiktokProfile;