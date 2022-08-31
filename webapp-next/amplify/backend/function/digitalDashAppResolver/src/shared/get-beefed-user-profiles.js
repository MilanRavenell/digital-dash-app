const Twitter = require('twitter-lite');
const axios = require("axios");
const getAccessToken = require('./get-access-token');

async function getBeefedUserProfiles(ctx, username) {
    const { ddbClient } = ctx.resources;

    const profiles = [];
    try {
        profiles.push(...(await ddbClient.query({
            TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            KeyConditionExpression: '#user = :user',
            ExpressionAttributeValues: { ':user': username },
            ExpressionAttributeNames: { '#user': 'user' }
        }).promise())
            .Items);

        return await Promise.all(profiles.map(async (profile) => ({
            user: profile.user,
            platform: profile.platform,
            profileName: profile.profileName,
            ...(await platformToProfileInfoGetterMap[profile.platform](ctx, profile)),
        })));
    } catch (err) {
        console.error(`Failed to fetch profiles for user ${username}`, err);
    }
}

async function getTwitterProfileInfo(ctx, profile) {
    const { id } = JSON.parse(profile.meta);

    try {
        const accessToken = await getAccessToken(ctx, profile);

        const client = new Twitter({
            consumer_key: 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ',
            consumer_secret: 'FaIS5ICp0qvbrRO30zSvngjZLyVU8VEY4V0lsklrsvu0CkK384',
            bearer_token: accessToken,
            version: '2',
            extension: false,
        });

        const response = await client.get(`users/${id}`, {
            'user.fields': 'public_metrics,profile_image_url,created_at',
        });
    
        return {
            followerCount: response.data.public_metrics.followers_count,
            profilePicUrl: response.data.profile_image_url,
        }
    } catch (err) {

        console.error('Failed to get twitter profile information', err);
        return {};
    }
    
}

async function getYoutubeProfileInfo(ctx, profile) {
    const { id } = JSON.parse(profile.meta);
    
    try {
        const accessToken = await getAccessToken(ctx, profile);
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&access_token=${accessToken}`);
        const item = response.data.items[0];
        const pic = item.snippet.thumbnails['default'];

        return {
            followerCount: item.statistics.subscriberCount,
            profilePicUrl: pic.url,
        }
    } catch (err) {
        // console.error('Failed to get youtube profile information', err);
        return {};
    }
}

async function getInstagramProfileInfo(ctx, profile) {
    const { account_id: accountId, access_token: accessToken } = JSON.parse(profile.meta);

    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${accountId}?fields=followers_count,profile_picture_url&access_token=${accessToken}`);

        return {
            followerCount: response.data.followers_count,
            profilePicUrl: response.data.profile_picture_url,
        }
    } catch (err) {
        // console.error('Failed to get innstagram profile information', err);
        return {};
    }
}



const platformToProfileInfoGetterMap = Object.freeze({
    'twitter': getTwitterProfileInfo,
    'youtube': getYoutubeProfileInfo, 
    'instagram': getInstagramProfileInfo,
});

module.exports = getBeefedUserProfiles;