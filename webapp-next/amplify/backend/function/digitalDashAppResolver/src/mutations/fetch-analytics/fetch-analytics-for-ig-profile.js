const axios = require("axios");
const { getAccessToken } = require('../../shared');

async function fetchAnalyticsForIgProfile (ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { account_id: accountId } = JSON.parse(profile.meta);

    const accessToken = await getAccessToken(ctx, profile);
    if (accessToken === null) {
        return;
    } 

    const mediaObjects = [];
    let url = `https://graph.facebook.com/v14.0/${accountId}/media?access_token=${accessToken}`;

    do {
        const response = await axios.get(url)
        mediaObjects.push(...response.data.data);
        url = response.data.paging.next;
    } while (url !== undefined)

    console.log(mediaObjects)
    const now = new Date().toISOString();

    await Promise.all(mediaObjects.map(async ({ id }) => {
        // get basic analyitcs
        const response = await axios.get(`https://graph.facebook.com/v14.0/${id}?fields=caption,comments_count,like_count,media_url,timestamp&access_token=${accessToken}`)
        let item = {
            id,
            profileName: profile.profileName,
            caption: response.data.caption || '',
            commentCount: response.data.comments_count,
            likeCount: response.data.like_count,
            link: response.data.media_url,
            engagementCount: response.data.comments_count + response.data.like_count,
            datePosted: response.data.timestamp,
            createdAt: now,
            updatedAt: now,
            __typename: 'InstagramPost',
        };

        try {
            // get creator account analytics if exists for post
            const response = await axios.get(`https://graph.facebook.com/v14.0/${id}/insights?metric=impressions,reach,saved,engagement&access_token=${accessToken}`)
            item = {
                ...item,
                viewCount: response.data.data[0].values[0].value,
                reachCount: response.data.data[1].values[0].value,
                saveCount: response.data.data[2].values[0].value,
                engagementCount: response.data.data[3].values[0].value,
            };
        } catch(err) {
            console.log(`Media object ${id} does not have business analytics`);
        }

        await ddbClient.put({
            TableName: 'InstagramPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Item: item
        }).promise();
    }));
}

module.exports = fetchAnalyticsForIgProfile;