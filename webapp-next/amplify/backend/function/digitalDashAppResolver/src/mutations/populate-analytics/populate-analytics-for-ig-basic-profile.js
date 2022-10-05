const axios = require("axios");
const AWS = require('aws-sdk');
const { makeApiRequest } = require('../../shared');

async function fetchAnalyticsForIgBasicProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;
    const { account_id: accountId, access_token: accessToken } = JSON.parse(profile.meta);
    const lambda = new AWS.Lambda({ region: 'us-west-2' });

    const mediaObjects = [];
    let nextToken = null;

    // Get all posts for the user
    do {
        const response = await makeApiRequest(ctx, profile, `v15.0/${accountId}/media`, accessToken, {
            'fields': 'id,caption,media_type,media_url,thumbnail_url,timestamp',
            ...(nextToken ? { 'after': nextToken } : {}),
        });

        if (!response) {
            return [];
        }

        mediaObjects.push(...response.data);

        nextToken = response.paging.next ? response.paging.next.split('after=')[1] : null;
    } while (nextToken !== null)

    const items = await Promise.all(mediaObjects.map(async (mediaObject) => {
        try {
            console.log(`getting ${post.id}`)
            const singleContentResponse = await lambda.invoke({
                FunctionName: 'web-scraper-service-staging-scrapeContent',
                Payload: JSON.stringify({
                    platform: 'instagram',
                    handle: profile.profileName,
                    task: 'process_single_content',
                    content_to_process: mediaObject.id,
                    use_tor: true,
                }),
            }).promise();

            // Get children media for album posts
            media = [];
            if (mediaObject.media_type === 'CAROUSEL_ALBUM') {
                nextToken = null;

                do {
                    const albumChildrenResponse = await makeApiRequest(ctx, profile, `${mediaObject.id}/children`, accessToken, {
                        'fields': 'media_type,thumbnail_url',
                        ...(nextToken ? { 'after': nextToken } : {}),
                    });
    
                    media.push(
                        albumChildrenResponse.data.map(child => ({
                            thumbnailUrl: child.thumbnail_url || '',
                            type: child.media_type,
                        })),
                    );

                    nextToken = response.paging.next ? response.paging.next.split('after=')[1] : null;
                } while (nextToken !== null)
            } else {
                media.push({
                    thumbnailUrl: mediaObject.thumbnail_url || '',
                    type: mediaObject.media_type,
                })
            }
    
            const extraInfo = JSON.parse(singleContentResponse.Payload);
            if (extraInfo.errorMessage) {
                return null
            }
    
            const now = new Date().toISOString();
            const commentCount = parseInt(extraInfo.comments || 0);
            const likeCount = parseInt(extraInfo.likes || 0);
            const engagementCount = commentCount + likeCount;

            const item = {
                id: post.id,
                profileName: profile.profileName,
                caption: mediaObject.caption || '',
                media,
                commentCount,
                likeCount,
                link: mediaObject.media_url,
                engagementCount,
                datePosted: mediaObject.timestamp || now,
                createdAt: now,
                updatedAt: now,
                __typename: 'InstagramPost',
            };
    
            if (!debug_noUploadToDDB) {
                await ddbClient.put({
                    TableName: 'InstagramPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
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

module.exports = fetchAnalyticsForIgBasicProfile;