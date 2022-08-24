const Twitter = require('twitter-lite');
const axios = require("axios");

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
            ...(await platformToProfileInfoGetterMap[profile.platform](profile)),
        })));
    } catch (err) {
        console.error(`Failed to fetch profiles for user ${username}`, err);
    }
}

async function getTwitterProfileInfo(profile) {
    const { id, accessToken } = JSON.parse(profile.meta);

    const client = new Twitter({
        consumer_key: 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ',
        consumer_secret: 'FaIS5ICp0qvbrRO30zSvngjZLyVU8VEY4V0lsklrsvu0CkK384',
        bearer_token: accessToken,
        version: '2',
        extension: false,
    });

    try {
        const response = await client.get(`users/${id}`, {
            'user.fields': 'public_metrics,profile_image_url,created_at',
        });
    
        return {
            profilePicUrl: response.data.profile_image_url,
        }
    } catch (err) {
        // if (err.status === 401) {
        //     const newProfile = await refreshTwitterToken(profile);
        //     return getTwitterProfileInfo(newProfile);
        // }

        console.error('Failed to get twitter profile information', err);
        return {};
    }
    
}

async function getYoutubeProfileInfo(profile) {
    const { id, accessToken } = JSON.parse(profile.meta);

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&access_token=${accessToken}`);
        const pic = response.data.items[0].snippet.thumbnails['default'];

        return {
            profilePicUrl: pic.url,
        }
    } catch (err) {
        // console.error('Failed to get youtube profile information', err);
        return {};
    }
}

async function getInstagramProfileInfo(profile) {
    const { account_id: accountId, access_token: accessToken } = JSON.parse(profile.meta);

    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${accountId}?fields=followers_count,profile_picture_url&access_token=${accessToken}`);

        return {
            profilePicUrl: response.data.profile_picture_url,
        }
    } catch (err) {
        // console.error('Failed to get innstagram profile information', err);
        return {};
    }
}

async function refreshTwitterToken(profile) {
    const { id, refreshToken } = JSON.parse(profile.meta);

    if (refreshToken === undefined) {
        return;
    }

    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');
    params.append('client_id', 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ')

    try {
        const response = await axios.post(
            `https://api.twitter.com/2/oauth2/token`,
            params,
            { 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }
        )

        const { access_token, refresh_token, expires_in } = response.data;
        const expires = new Date(new Date().getTime() + (1000 * expires_in)).toISOString();

        const newMeta = JSON.stringify({
            id,
            accessToken: access_token,
            refreshToken: refresh_token,
            expires,
        });

        await ddbClient.update({
            TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Key: {
                user: profile.user,
                profileName: profile.profileName,
            },
            UpdateExpression: 'SET #meta = :meta',
            ExpressionAttributeNames: {
                "#meta": "meta"
            },
            ExpressionAttributeValues: {
                ":meta": newMeta,
            }
        }).promise();

        return {
            ...profile,
            meta: newMeta,
        }
    } catch (err) {
        console.log('Failed to fetch access token', err)
        return profile;
    }
}

const platformToProfileInfoGetterMap = Object.freeze({
    'twitter': getTwitterProfileInfo,
    'youtube': getYoutubeProfileInfo, 
    'instagram': getInstagramProfileInfo,
});

module.exports = getBeefedUserProfiles;