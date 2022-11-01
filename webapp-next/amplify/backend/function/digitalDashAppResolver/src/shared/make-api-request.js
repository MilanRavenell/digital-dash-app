const axios = require("axios");
const rateLimit = require( 'axios-rate-limit');
const Twitter = require('twitter-lite');

const http = rateLimit(axios.create(), {
    maxRPS: 50,
})

async function makeApiRequest(ctx, profile, endpoint, accessToken, params = {}) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    const platformMap = Object.freeze({
        'twitter': makeTwitterApiRequest,
        'youtube': makeYoutubeApiRequest,
        'instagram-pro': makeIgProApiRequest,
        'instagram-basic': makeIgBasicRequest,
    });

    try {
        return await platformMap[profile.platform](ctx, endpoint, accessToken, params);
    } catch (err) {
        console.error('Failed to make api request');

        if (err.name === 'AxiosError' && err.response && err.response.data) {
            console.error(err.response.data)
        } else {
            console.error(err);
        }

        return null;
    }
}

async function makeTwitterApiRequest(ctx, endpoint, accessToken, params) {
    const { envVars } = ctx.resources;
    const { TWITTER_API_KEY, TWITTER_API_SECRET } = envVars;

    try {
        const client = new Twitter({
            consumer_key: TWITTER_API_KEY,
            consumer_secret: TWITTER_API_SECRET,
            bearer_token: accessToken,
            version: '2',
            extension: false,
        });
    
        return await client.get(endpoint, params);
    } catch (err) {
        if (err.title === 'Unauthorized') {
            throw new Error('InvalidAccessToken');
        }

        throw err;
    }
}

async function makeYoutubeApiRequest(ctx, endpoint, accessToken, params) {
    try {
        const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
            acc += `&${key}=${value}`
            return acc;
        }, '');

        const url = `https://www.googleapis.com/youtube/v3/${endpoint}?access_token=${accessToken}${queryParams}`;
    
        return (await http.get(url)).data;
    } catch (err) {
        if (
            err.name === 'AxiosError'
            && err.response
            && err.response.data
            && err.response.data.error
            && err.response.data.error.message
            && err.response.data.error.message.includes('The request is missing a valid API key.')
        ) {            
                throw new Error('InvalidAccessToken');
        }

        throw err;
    }
}

async function makeIgProApiRequest(ctx, endpoint, accessToken, params) {
    try {
        const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
            acc += `&${key}=${value}`
            return acc;
        }, '');

        const url = `https://graph.facebook.com/v14.0/${endpoint}?access_token=${accessToken}${queryParams}`;
    
        return (await http.get(url)).data;
    } catch (err) {
        // Do not throw if attempt to fetch analytics for media posted before business account conversion
        if (
            err.name === 'AxiosError'
            && err.response
            && err.response.data
            && err.response.data.error
        ) {
            if (err.response.data.error.error_user_title === 'Media Posted Before Business Account Conversion') {
                return null;
            }
            
            if (err.response.data.error.message.includes('Invalid OAuth access token')) {
                throw new Error('InvalidAccessToken');
            } 
        }

        throw err;
    }
}

async function makeIgBasicRequest(ctx, endpoint, accessToken, params) {
    try {
        const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
            acc += `&${key}=${value}`
            return acc;
        }, '');

        const url = `https://graph.instagram.com/${endpoint}?access_token=${accessToken}${queryParams}`;
    
        return (await http.get(url)).data;
    } catch (err) {
        // Do not throw if attempt to fetch analytics for media posted before business account conversion
        if (
            err.name === 'AxiosError'
            && err.response
            && err.response.data
            && err.response.data.error
            && err.response.data.error.message.includes('Invalid OAuth access token')
        ) {
            throw new Error('InvalidAccessToken');
        }

        throw err;
    }
}

module.exports = makeApiRequest;

