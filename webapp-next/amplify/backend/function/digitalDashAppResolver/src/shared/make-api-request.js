const axios = require("axios");
const rateLimit = require( 'axios-rate-limit');
const Twitter = require('twitter-lite');

const http = rateLimit(axios.create(), {
    maxRPS: 50,
})

async function makeApiRequest(ctx, profile, endpoint, accessToken, params = {}) {
    const { ddbClient } = ctx.resources;

    const platformMap = Object.freeze({
        'twitter': makeTwitterApiRequest,
        'youtube': makeYoutubeApiRequest,
        'instagram-pro': makeIgProApiRequest,
    });

    try {
        return await platformMap[profile.platform](endpoint, accessToken, params);
    } catch (err) {
        console.error('Failed to make api request');

        if (err.name === 'AxiosError' && err.response && err.response.data) {
            console.error(err.response.data)
        } else {
            console.error(err);
        }

        if (err.message === 'InvalidAccessToken') {
            await ddbClient.update({
                TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Key: {
                    user: profile.user,
                    key: `${profile.platform}_${profile.profileName}`,
                },
                UpdateExpression: 'SET #needsRefresh = :needsRefresh',
                ExpressionAttributeNames: {
                    "#needsRefresh": "needsRefresh"
                },
                ExpressionAttributeValues: {
                    ":needsRefresh": true,
                },
            }).promise();
        }

        return null;
    }
}

async function makeTwitterApiRequest(endpoint, accessToken, params) {
    try {
        const client = new Twitter({
            consumer_key: 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ',
            consumer_secret: 'FaIS5ICp0qvbrRO30zSvngjZLyVU8VEY4V0lsklrsvu0CkK384',
            bearer_token: accessToken + 'k',
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

async function makeYoutubeApiRequest(endpoint, accessToken, params) {
    try {
        const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
            acc += `&${key}=${value}`
            return acc;
        }, '');

        const url = `https://www.googleapis.com/youtube/v3/${endpoint}?&access_token=${accessToken}${queryParams}`;
    
        return (await http.get(url)).data;
    } catch (err) {
        if (
            err.name === 'AxiosError'
            && err.response
            && err.response.data
            && err.response.data.error
        ) {            
            if (err.response.data.error.message.includes('The request is missing a valid API key.')) {
                throw new Error('InvalidAccessToken');
            } 
        }

        throw err;
    }
}

async function makeIgProApiRequest(endpoint, accessToken, params) {
    try {
        const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
            acc += `&${key}=${value}`
            return acc;
        }, '');

        const url = `https://graph.facebook.com/v14.0/${endpoint}?&access_token=${accessToken}${queryParams}`;
    
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

module.exports = makeApiRequest;

