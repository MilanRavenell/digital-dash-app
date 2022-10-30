const axios = require("axios");
const AWS = require('aws-sdk');
const { invokeWebScraper } = require('../../shared');

async function fetchAnalyticsForTiktokProfile(ctx, profile) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { debug_noUploadToDDB } = ctx.arguments.input;

    console.log(`fetching analytics for ${profile.key}`);

    // get all DDB posts
    const ddbPosts = await getDDBPosts(ctx, profile);

    if (ddbPosts === null) {
        return;
    }

    const ddbPostIdsSet = new Set(ddbPosts.map(({ id }) => id));
    
    // get scraped videos
    const scrapedVideos = await invokeWebScraper(ctx, {
        platform: 'tiktok',
        handle: profile.profileName,
        task: 'full_run',
        use_tor: true,
    });
    console.log('scraped videos: ', scrapedVideos)

    if (!Array.isArray(scrapedVideos)) {
        console.error('Failed to get videos', scrapedVideos.errorMessage)
        return;
    }

    const allVideos = [
        ...scrapedVideos.filter(({ id }) => !ddbPostIdsSet.has(id)),
        ...ddbPosts.map((post) =>{
            const scrapedVideo = scrapedVideos.find(({ id }) => id === post.id);

            return {
                ...post,
                views: post.viewCount,
                ...(scrapedVideo || {}),
            }
        }),
    ]

    const items = await Promise.all(allVideos.slice(0, 300).map(async (video) => {
        try {
            const extraInfo = await invokeWebScraper(ctx, {
                platform: 'tiktok',
                handle: profile.profileName,
                task: 'process_single_content',
                content_to_process: video.id,
                use_tor: true,
            });

            if (extraInfo.errorMessage) {
                throw new Error(`webscraper error ${extraInfo.errorMessage}`);
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
                caption: extraInfo.caption || '',
                media: [{
                    thumbnailUrl: extraInfo.thumbnail_url || '',
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
                datePosted: video.datePosted || extraInfo.date,
                createdAt: video.createdAt || now,
            };
    
            if (!debug_noUploadToDDB) {
                await ddbClient.put({
                    TableName: `TiktokPost-${appsync_api_id}-${env}`,
                    Item: item
                }).promise();
            } else {
                console.log(item)
            }
        } catch (err) {
            console.error(`Failed to get analytics for tiktok ${video.id}`, err);
            return null;
        }
    }));
}

async function getDDBPosts(ctx, profile) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    // TODO: add pagination
    try {
        return (await ddbClient.query({
            TableName: `TiktokPost-${appsync_api_id}-${env}`,
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

module.exports = fetchAnalyticsForTiktokProfile;