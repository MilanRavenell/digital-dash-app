const axios = require("axios");
const rateLimit = require( 'axios-rate-limit');

const http = rateLimit(axios.create(), {
    maxRPS: 50,
})

async function fetchAnalyticsForIgProProfile (ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;
    const { account_id: accountId, access_token: accessToken } = JSON.parse(profile.meta);

    const mediaObjects = [];
    let url = `https://graph.facebook.com/v14.0/${accountId}/media?access_token=${accessToken}`;

    do {
        const response = await http.get(url)
        mediaObjects.push(...response.data.data);
        url = response.data.paging.next;
    } while (url !== undefined)

    const now = new Date().toISOString();
    const items = await Promise.all(mediaObjects.map(async ({ id }) => {
        // get basic analyitcs
        const response = await http.get(`https://graph.facebook.com/v14.0/${id}?fields=caption,comments_count,like_count,media_url,timestamp,permalink,thumbnail_url,media_type&access_token=${accessToken}`);

        const media = await getMedia(id, response.data, accessToken);

        let item = {
            id,
            profileName: profile.profileName,
            caption: response.data.caption || '',
            commentCount: response.data.comments_count,
            likeCount: response.data.like_count,
            link: response.data.permalink,
            media,
            engagementCount: response.data.comments_count + response.data.like_count,
            datePosted: response.data.timestamp,
            createdAt: now,
            updatedAt: now,
            __typename: 'InstagramPost',
        };

        try {
            // get creator account analytics if exists for post
            const response = await http.get(`https://graph.facebook.com/v14.0/${id}/insights?metric=impressions,reach,saved,engagement&access_token=${accessToken}`)
            item = {
                ...item,
                viewCount: response.data.data[0].values[0].value,
                reachCount: response.data.data[1].values[0].value,
                saveCount: response.data.data[2].values[0].value,
                engagementCount: response.data.data[3].values[0].value,
            };
        } catch(err) {
        }

        if (!debug_noUploadToDDB) {
            await ddbClient.put({
                TableName: 'InstagramPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Item: item
            }).promise();
        }

        return item;
    }));

    return items;
}

async function getMedia(id, responseData, accessToken) {
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
    const album_objects = (await http.get(`https://graph.facebook.com/v14.0/${id}/children?access_token=${accessToken}`)).data.data;

    return (await Promise.all(album_objects.map(async (object) => {
        const mediaObject = (await http.get(`https://graph.facebook.com/v14.0/${object.id}?fields=media_url,thumbnail_url,media_type&access_token=${accessToken}`)).data;
        return await getMedia(id, mediaObject, accessToken);
    }))).flat();
}

module.exports = fetchAnalyticsForIgProProfile;