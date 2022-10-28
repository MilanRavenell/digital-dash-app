const axios = require("axios");

const platformRefresherMap = Object.freeze({
    'twitter': refreshTwitterTokens,
    'youtube': refreshYoutubeTokens,
});

async function getAccessToken(ctx, profile) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    if (profile.needsRefresh) {
        return null;
    }

    const platformRefresher = platformRefresherMap[profile.platform];
    if (!platformRefresher) {
        return null;
    }

    const { accessToken, expires } = JSON.parse(profile.meta);

    if (new Date() < new Date(expires)) {
        return accessToken;
    }

    console.log(`Refreshing token for ${profile.key}`);

    try {
        return await platformRefresherMap[profile.platform](ctx, profile);
    } catch (err) {
        console.error('Failed to fetch access token');
        if (err.name === 'AxiosError' && err.response && err.response.data) {
            console.error(err.response.data)
        } else {
            console.error(err);
        }

        console.log('profile needs refresh')
        await ddbClient.update({
            TableName: `UserProfile-${appsync_api_id}-${env}`,
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

async function refreshTwitterTokens(ctx, profile) {
    const { id, refreshToken } = JSON.parse(profile.meta);
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id, TWITTER_API_KEY } = envVars;

    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');
    params.append('client_id', TWITTER_API_KEY)

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

    // Update profile with new tokens
    await ddbClient.update({
        TableName: `UserProfile-${appsync_api_id}-${env}`,
        Key: {
            user: profile.user,
            key: `${profile.platform}_${profile.profileName}`,
        },
        UpdateExpression: 'SET #meta = :meta',
        ExpressionAttributeNames: {
            "#meta": "meta"
        },
        ExpressionAttributeValues: {
            ":meta": newMeta,
        },
    }).promise();

    console.log(`Successfully refreshed token for profile ${profile.key}`);

    return access_token;
}

async function refreshYoutubeTokens(ctx, profile) {
    const { id, refreshToken, uploadsId } = JSON.parse(profile.meta);
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id, GOOG_OAUTH_CLIENT_ID, GOOG_OAUTH_CLIENT_SECRET } = envVars;

    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');
    params.append('client_id', GOOG_OAUTH_CLIENT_ID)
    params.append('client_secret', GOOG_OAUTH_CLIENT_SECRET)


    const response = await axios.post(
        `https://oauth2.googleapis.com/token`,
        params,
        { 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }
    )

    const { access_token, expires_in, } = response.data;
    const expires = new Date(new Date().getTime() + (1000 * expires_in)).toISOString();

    const newMeta = JSON.stringify({
        id,
        accessToken: access_token,
        refreshToken,
        uploadsId,
        expires,
    });

    // Update profile with new tokens
    await ddbClient.update({
        TableName: `UserProfile-${appsync_api_id}-${env}`,
        Key: {
            user: profile.user,
            key: `${profile.platform}_${profile.profileName}`,
        },
        UpdateExpression: 'SET #meta = :meta',
        ExpressionAttributeNames: {
            "#meta": "meta"
        },
        ExpressionAttributeValues: {
            ":meta": newMeta,
        }
    }).promise();

    return access_token;
}

module.exports = getAccessToken;