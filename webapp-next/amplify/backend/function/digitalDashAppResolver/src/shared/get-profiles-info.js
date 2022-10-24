const Twitter = require('twitter-lite');
const axios = require("axios");
const AWS = require('aws-sdk');
const makeApiRequest = require('./make-api-request');

async function getProfileInfo(ctx, profile, accessToken) {
    try {
        return await platformToProfileInfoGetterMap[profile.platform](ctx, profile, accessToken);
    } catch (err) {
        console.error(`Failed to fetch profile for user ${username}`, err);
        return {};
    }
}

async function getTwitterProfileInfo(ctx, profile, accessToken) {
    const { id } = JSON.parse(profile.meta);

        if (!accessToken) {
            return {}
        }

    try {

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

async function getYoutubeProfileInfo(ctx, profile, accessToken) {
    const { id } = JSON.parse(profile.meta);
    
    try {
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
        console.error('Failed to get instagram pro profile information', err);
        return {};
    }
}

async function getTikTokProfileInfo(ctx, profile) {
    console.log('getting tiktok profile')
    try {
        const lambda = new AWS.Lambda({ region: 'us-west-2' });

        const response = await lambda.invoke({
            FunctionName: 'web-scraper-service-staging-scrapeContent',
            Payload: JSON.stringify({
                platform: 'tiktok',
                handle: profile.profileName,
                task: 'get_profile_info',
                use_tor: true,
            }),
        }).promise();
        console.log(response)
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

async function getInstagramBasicProfileInfo(ctx, profile) {
    console.log('getting ig basic profile')
    try {
        const lambda = new AWS.Lambda({ region: 'us-west-2' });

        const response = await lambda.invoke({
            FunctionName: 'web-scraper-service-staging-scrapeContent',
            Payload: JSON.stringify({
                platform: 'instagram',
                handle: profile.profileName,
                task: 'get_profile_info',
                use_tor: false,
            }),
        }).promise();
        console.log(response)
        const data = JSON.parse(response.Payload)

        return {
            followerCount: data.followers,
            profilePicUrl: `/api/fetch-image?url=${data.profile_pic_url.replace(/&/g, '@@@@')}`, // instagram-basic pic links cannot be accessed by the DOM, need to fetch image through the backend
        }
    } catch (err) {
        console.error('Failed to get instagram basic profile information', err);
        return {};
    }
}



const platformToProfileInfoGetterMap = Object.freeze({
    'twitter': getTwitterProfileInfo,
    'youtube': getYoutubeProfileInfo, 
    'instagram-pro': getInstagramProProfileInfo,
    'instagram-basic': getInstagramBasicProfileInfo,
    'tiktok': getTikTokProfileInfo,
});

module.exports = getProfileInfo;