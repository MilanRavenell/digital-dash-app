const Twitter = require('twitter-lite');
const axios = require("axios");
const AWS = require('aws-sdk');
const getAccessToken = require('./get-access-token');
const makeApiRequest = require('./make-api-request');

async function getProfileInfo(ctx, profile) {
    try {
        return await platformToProfileInfoGetterMap[profile.platform](ctx, profile);
    } catch (err) {
        console.error(`Failed to fetch profile for user ${username}`, err);
        return {};
    }
}

async function getTwitterProfileInfo(ctx, profile) {
    const { id } = JSON.parse(profile.meta);

    try {
        const accessToken = await getAccessToken(ctx, profile);
        if (!accessToken) {
            return {}
        }

        const response = await makeApiRequest(ctx, profile, `users/${id}`, accessToken, {
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
        if (!accessToken) {
            return {}
        }
        
        const response = await makeApiRequest(ctx, profile, 'channels', accessToken, {
            'part': 'snippet,statistics',
            id,
        });
        const item = response.items[0];
        const pic = item.snippet.thumbnails['default'];

        return {
            followerCount: item.statistics.subscriberCount,
            profilePicUrl: pic.url,
        }
    } catch (err) {
        console.error('Failed to get youtube profile information', err);
        return {};
    }
}

async function getInstagramProProfileInfo(ctx, profile) {
    const { account_id: accountId, access_token: accessToken } = JSON.parse(profile.meta);

    try {
        const response = await makeApiRequest(ctx, profile, accountId, accessToken, {
            'fields': 'followers_count,profile_picture_url',

        });

        return {
            followerCount: response.followers_count,
            profilePicUrl: response.profile_picture_url,
        }
    } catch (err) {
        console.error('Failed to get instagram profile information', err);
        return {};
    }
}

async function getTikTokProfileInfo(ctx, profile) {
    return {}
    try {
        const lambda = new AWS.Lambda({ region: 'us-west-2' });

        const response = await lambda.invoke({
            FunctionName: 'web-scraper-service-staging-scrapeContent',
            Payload: JSON.stringify({
                platform: 'tiktok',
                handle: profile.profileName,
                task: 'get_profile_info',
            }),
        }).promise();
        const data = JSON.parse(response.Payload)

        return {
            followerCount: data.followers,
            profilePicUrl: data.profile_pic_url,
        }
    } catch (err) {
        console.error('Failed to get tiktok profile information', err);
        return {};
    }
}



const platformToProfileInfoGetterMap = Object.freeze({
    'twitter': getTwitterProfileInfo,
    'youtube': getYoutubeProfileInfo, 
    'instagram-pro': getInstagramProProfileInfo,
    'tiktok': getTikTokProfileInfo,
});

module.exports = getProfileInfo;