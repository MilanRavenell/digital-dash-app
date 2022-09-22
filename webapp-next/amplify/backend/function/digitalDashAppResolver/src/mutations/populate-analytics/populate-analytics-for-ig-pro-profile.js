const { makeApiRequest } = require('../../shared');

async function fetchAnalyticsForIgProProfile (ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;
    const { account_id: accountId, access_token: accessToken } = JSON.parse(profile.meta);

    const mediaObjects = [];
    let nextToken = null;

    do {
        const response = await makeApiRequest(ctx, profile, `${accountId}/media`, accessToken, {
            ...(nextToken ? { 'after': nextToken } : {}),
        });

        if (!response) {
            return [];
        }

        mediaObjects.push(...response.data);

        nextToken = response.paging.next ? response.paging.next.split('after=')[1] : null;
    } while (nextToken !== null)

    const now = new Date().toISOString();
    const items = await Promise.all(mediaObjects.map(async ({ id }) => {
        try {
            // get basic analyitcs
            const response = await makeApiRequest(ctx, profile, id, accessToken, {
                'fields': 'caption,comments_count,like_count,media_url,timestamp,permalink,thumbnail_url,media_type',
            });

            const media = await getMedia(ctx, profile, id, response, accessToken);

            const item = {
                id,
                profileName: profile.profileName,
                caption: response.caption || '',
                commentCount: response.comments_count,
                likeCount: response.like_count,
                link: response.permalink,
                media,
                engagementCount: response.comments_count + response.like_count,
                datePosted: response.timestamp,
                createdAt: now,
                updatedAt: now,
                __typename: 'InstagramPost',
            };

            // get creator account analytics if exists for post
            const businessResponse = await makeApiRequest(ctx, profile, `${id}/insights`, accessToken, {
                'metric': 'impressions,reach,saved,engagement',
            });

            if (businessResponse) {
                item.viewCount = businessResponse.data[0].values[0].value;
                item.reachCount = businessResponse.data[1].values[0].value;
                item.saveCount = businessResponse.data[2].values[0].value;
                item.engagementCount = businessResponse.data[3].values[0].value;
            }

            if (!debug_noUploadToDDB) {
                await ddbClient.put({
                    TableName: 'InstagramPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                    Item: item
                }).promise();
            }

            return item;
        } catch (err) {
            console.error(`Failed to fecth data for media object ${id}`)
            if (err.name === 'AxiosError' && err.response && err.response.data) {
                console.error(err.response.data)
            } else {
                console.error(err)
            }
            return null;
        }
        
    }));

    return items.filter(item => (item !== null));
}

async function getMedia(ctx, profile, id, responseData, accessToken) {
    if (!responseData) {
        return [];
    }

    if (responseData.media_type === 'VIDEO') {
        return [{
            thumbnailUrl: responseData.thumbnail_url,
            type: 'video'
        }];
    }

    if (responseData.media_type === 'IMAGE') {
        return [{
            thumbnailUrl: responseData.media_url,
            type: 'photo'
        }];
    }

    // media_type is CAROUSEL_ALBUM
    const album_objects = (await makeApiRequest(ctx, profile, `${id}/children`, accessToken)).data;

    return (await Promise.all(album_objects.map(async (object) => {
        const mediaObject = await makeApiRequest(ctx, profile, object.id, accessToken, {
            'fields': 'media_url,thumbnail_url,media_type',
        });
        return await getMedia(ctx, profile, id, mediaObject, accessToken);
    }))).flat();
}

module.exports = fetchAnalyticsForIgProProfile;