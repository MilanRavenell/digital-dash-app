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
    
    console.log(`fetching analytics for ${profile.key}`);

    try {
        const accessToken = await getAccessToken(ctx, profile);
        
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

        console.log('done')

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
    console.log('populateProfile')
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { debug_noUploadToDDB } = ctx.arguments.input;

    // TODO: Retrieve from configuration table
    const metrics = ['followerCount']

    const profileInfo = await getProfileInfo(ctx, profile, accessToken);

    if (!profileInfo) {
        return;
    }

    try {
        await Promise.all(Object.entries(profileInfo).map(async ([key, value]) => {
            // Update user profile
            const updateParams = {
                TableName: `UserProfile-${appsync_api_id}-${env}`,
                Key: {
                    user: profile.user,
                    key: profile.key,
                },
                UpdateExpression: 'SET #property = :value',
                ExpressionAttributeNames: {
                    "#property": key,
                },
                ExpressionAttributeValues: {
                    ":value": value,
                },
            };

            if (!debug_noUploadToDDB) {
                await ddbClient.update(updateParams).promise();
            } else {
                console.log(updateParams);
            }

            if (metrics.includes(key) && value) {
                const item = {
                    key: `${profile.key}_${key}`,
                    profileKey: profile.key,
                    metric: key,
                    createdAt: new Date().toISOString(),
                    value,
                };

                if (!debug_noUploadToDDB) {
                    await ddbClient.put({
                        TableName: `MetricHistory-${appsync_api_id}-${env}`,
                        Item: item,
                    }).promise();
                } else {
                    console.log(item);
                }
            }
        }));

        if (profileInfo.followerCount === null || profileInfo.followerCount === undefined) {
            throw new Error('followerCount was null');
        }

        
    } catch (err) {
        console.error('Failed to update profile info', err)
    }
}

async function populatePosts(ctx, profile, accessToken) {
    console.log('populatePosts')
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