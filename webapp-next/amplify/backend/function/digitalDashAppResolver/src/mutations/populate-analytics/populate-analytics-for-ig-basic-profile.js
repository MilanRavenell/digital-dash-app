const axios = require("axios");
const AWS = require('aws-sdk');
const { makeApiRequest } = require('../../shared');

async function fetchAnalyticsForIgBasicProfile(ctx, profile) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { debug_noUploadToDDB } = ctx.arguments.input;
    const { account_id: accountId, accessToken } = JSON.parse(profile.meta);
    const lambda = new AWS.Lambda({ region: 'us-west-2' });

    // get all DDB posts
    const ddbPosts = await getCollectedPosts(ctx, profile);

    if (ddbPosts === null) {
        return;
    }

    const ddbPostIdsSet = new Set(ddbPosts.map(({ id }) => id));

    const getContentResponse = await lambda.invoke({
        FunctionName: 'web-scraper-service-staging-scrapeContent',
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
    scrapedMediaObjects.sort((a, b) => b.taken_at_timestamp - a.taken_at_timestamp)

    const mediaObjects = [
        ...scrapedMediaObjects.filter(({ shortcode }) => !ddbPostIdsSet.has(shortcode)),
        ...ddbPosts.map((post) =>{
            const scrapedMediaObject = scrapedMediaObjects.find(({ shortcode }) => shortcode === post.id);

            return {
                ...post,
                views: post.viewCount,
                timestamp: post.datePosted,
                shortcode: post.id,
                media: post.media,
                ...(scrapedMediaObject || {}),
            }
        }),
    ]

    // Get fetch post data from instagram api
    let i = 0;
    let nextToken = null;
    do {
        const response = await makeApiRequest(ctx, profile, `v15.0/${accountId}/media`, accessToken, {
            'fields': 'caption,media_type,media_url,thumbnail_url,timestamp',
            ...(nextToken ? { 'after': nextToken } : {}),
        });

        if (!response) {
            return [];
        }

        response.data.forEach(datum => {
            if (i < mediaObjects.length) {
                mediaObjects[i] = {
                    ...mediaObjects[i],
                    ...datum,
                }
            }
            
            i++;
        });

        nextToken = response.paging.next ? response.paging.next.split('after=')[1] : null;
    } while (nextToken !== null && i < mediaObjects.length)

    const items = await Promise.all(mediaObjects.map(async (mediaObject) => {
        try {
            // Get children media for album posts
            const media = mediaObject.media || [];
            if (media.length === 0) {
                if (mediaObject.media_type === 'CAROUSEL_ALBUM') {
                    nextToken = null;
    
                    do {
                        const albumChildrenResponse = await makeApiRequest(ctx, profile, `${mediaObject.id}/children`, accessToken, {
                            'fields': 'media_type,thumbnail_url,media_url',
                            ...(nextToken ? { 'after': nextToken } : {}),
                        });
        
                        media.push(
                            ...albumChildrenResponse.data.map(child => ({
                                thumbnailUrl: (child.media_type === 'VIDEO' ? child.thumbnail_url : child.media_url) || '',
                                type: child.media_type.toLowerCase(),
                            })),
                        );
    
                        nextToken = albumChildrenResponse.paging?.next ? albumChildrenResponse.paging.next.split('after=')[1] : null;
                    } while (nextToken !== null)
                } else {
                    media.push({
                        thumbnailUrl: (mediaObject.media_type === 'VIDEO' ? mediaObject.thumbnail_url : mediaObject.media_url) || '',
                        type: mediaObject.media_type.toLowerCase(),
                    })
                }
            }

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