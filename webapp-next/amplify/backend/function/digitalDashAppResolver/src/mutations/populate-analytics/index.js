const populateAnalyticsForIgProProfile = require('./populate-analytics-for-ig-pro-profile');
const populateAnalyticsForIgBasicProfile = require('./populate-analytics-for-ig-basic-profile')
const populateAnalyticsForTwitterProfile = require('./populate-analytics-for-twitter-profile');
const populateAnalyticsForYtProfile = require('./populate-analytics-for-yt-profile');
const populateAnalyticsForTiktokProfile = require('./populate-analytics-for-tiktok-profile');
const { getProfileInfo, getAccessToken } = require('../../shared');

async function fetchAnalytics(ctx) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { username, profileKey, debug_noUploadToDDB } = ctx.arguments.input;

    // Do not fetch posts if it's been less then an hour since posts were last fetched
    let profile = null;
    try {
        profile = (await ddbClient.get({
            TableName: `UserProfile-${appsync_api_id}-${env}`,
            Key: { user: username, key: profileKey },
        }).promise()).Item;
    } catch (err) {
        console.error('Failed to fetch user', err);
        return {
            dataUpdated: false,
            success: false,
        }
    }
    
    console.log('Fetching data');

    try {
        const accessToken = await getAccessToken(ctx, profile);

        if (!accessToken) {
            return {
                dataUpdated: false,
                success: false,
            }
        }

        await Promise.all([populateProfile(ctx, profile, accessToken), populatePosts(ctx, profile, accessToken)])

        if (!debug_noUploadToDDB) {
            // Set postsLastPopulated for the user to now
            await ddbClient.update({
                TableName: `UserProfile-${appsync_api_id}-${env}`,
                Key: { user: username, key: profileKey },
                UpdateExpression: 'SET #postsLastPopulated = :postsLastPopulated',
                ExpressionAttributeNames: { 
                    '#postsLastPopulated': 'postsLastPopulated',
                },
                ExpressionAttributeValues: {
                    ':postsLastPopulated': new Date().toISOString(),
                },
            }).promise();
        }

        return {
            dataUpdated: true,
            success: true,
        }
    } catch (err) {
        console.error(`Failed to fetch analytics for user ${username}`);
        if (err.name === 'AxiosError' && err.response && err.response.data) {
            console.error('Error data: ', err.response.data)
        } else {
            console.error(err)
        }
        return {
            dataUpdated: false,
            success: false,
        }
    }
}

// Fetch  latest profile info
async function populateProfile(ctx, profile, accessToken) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { debug_noUploadToDDB } = ctx.arguments.input;

    const profileInfo = await getProfileInfo(ctx, profile, accessToken);

    if (!profileInfo) {
        return;
    }

    if (!debug_noUploadToDDB) {
        try {
            await ddbClient.put({
                TableName: `UserProfile-${appsync_api_id}-${env}`,
                Item: {
                    ...profile,
                    ...profileInfo,
                }
            }).promise();

            if (profileInfo.followerCount === null || profileInfo.followerCount === undefined) {
                throw new Error('followerCount was null');
            }
    
            await ddbClient.put({
                TableName: `MetricHistory-${appsync_api_id}-${env}`,
                Item: {
                    key: `${profile.key}_followerCount`,
                    profileKey: profile.key,
                    metric: 'followerCount',
                    createdAt: new Date().toISOString(),
                    value: profileInfo.followerCount,
                }
            }).promise();
        } catch (err) {
            console.error('Failed to update profile info', err)
        }
    }
    else {
        console.log(profileInfo);
    }
}

async function populatePosts(ctx, profile, accessToken) {
    try {
        switch(profile.platform) {
            case 'instagram-pro':
                let tries = 0;
                let success = false;
                while (tries < 10 && !success) {
                    try {
                        await populateAnalyticsForIgProProfile(ctx, profile);
                        success = true;
                    } catch (err) {
                        console.log(err)
                        tries += 1;
                        // sleep for 2 seconds
                        console.log(`hit timeout, retrying (${tries})`)
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }
                
                if (tries >= 10) {
                    console.error('hit instagram retry limit');
                }
                break;
            case 'instagram-basic':
                await populateAnalyticsForIgBasicProfile(ctx, profile);
                break;
            case 'twitter':
                await populateAnalyticsForTwitterProfile(ctx, profile, accessToken);
                break;
            case 'youtube':
                await populateAnalyticsForYtProfile(ctx, profile, accessToken);
                break;
            case 'tiktok':
                await populateAnalyticsForTiktokProfile(ctx, profile);
                break;
            default:
                console.log(`Platform ${profile.platform} not supported`);
        };
    } catch (err) {
        console.error(`Failed to populate posts for profile ${profile.key}`);
    }
    
}

module.exports = fetchAnalytics;