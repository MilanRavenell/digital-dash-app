const fetchAnalyticsForIgProProfile = require('./populate-analytics-for-ig-pro-profile');
const populateAnalyticsForTwitterProfile = require('./populate-analytics-for-twitter-profile');
const populateAnalyticsForYtProfile = require('./populate-analytics-for-yt-profile');
const populateAnalyticsForTiktokProfile = require('./populate-analytics-for-tiktok-profile');
const { getProfileInfo } = require('../../shared');

async function fetchAnalytics(ctx) {
    const { ddbClient } = ctx.resources;
    const { username, profileKey, debug_noUploadToDDB } = ctx.arguments.input;

    // Do not fetch posts if it's been less then an hour since posts were last fetched
    let profile = null;
    try {
        profile = (await ddbClient.get({
            TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Key: { user: username, key: profileKey },
        }).promise()).Item;
    
        const now = new Date();
        const postsLastPopulated = new Date(profile.postsLastPopulated);
    
        if (
            (profile.postsLastPopulated
            && (now - postsLastPopulated < 3600000))
            && (debug_noUploadToDDB === undefined)
        ) {
            console.log('Too soon to fetch new data');
            return {
                dataUpdated: false,
                success: true,
            }
        }
    } catch (err) {
        console.error('Failed to fetch user', err);
        return {
            dataUpdated: false,
            success: true,
        }
    }
    
    console.log('Fetching data');

    try {
        
        await Promise.all([populateProfile(ctx, profile), populatePosts(ctx, profile)])

        // Set postsLastPopulated for the user to now
        await ddbClient.update({
            TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Key: { user: username, key: profileKey },
            UpdateExpression: 'SET #postsLastPopulated = :postsLastPopulated',
            ExpressionAttributeNames: { 
                '#postsLastPopulated': 'postsLastPopulated',
            },
            ExpressionAttributeValues: {
                ':postsLastPopulated': new Date().toISOString(),
            },
        }).promise();

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
async function populateProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;

    const profileInfo = await getProfileInfo(ctx, profile);

    if (!debug_noUploadToDDB) {
        try {
            await ddbClient.put({
                TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Item: {
                    ...profile,
                    ...profileInfo,
                }
            }).promise();
    
            await ddbClient.put({
                TableName: 'MetricHistory-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Item: {
                    key: `${profile.key}_followerCount`,
                    profileKey: profile.key,
                    metric: 'followerCount',
                    createdAt: new Date().toISOString(),
                    value: profileInfo.followerCount,
                }
            }).promise();
        } catch (err) {
            console.error('Failed to update profile info')
        }
    }
    else {
        console.log(profileInfo);
    }
}

async function populatePosts(ctx, profile) {
    switch(profile.platform) {
        case 'instagram-pro':
            let tries = 0;
            let success = false;
            while (tries < 10 && !success) {
                try {
                    await fetchAnalyticsForIgProProfile(ctx, profile);
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
            populateAnalyticsForIgBasicProfile(ctx, profile);
            break;
        case 'twitter':
            await populateAnalyticsForTwitterProfile(ctx, profile);
            break;
        case 'youtube':
            await populateAnalyticsForYtProfile(ctx, profile);
            break;
        case 'tiktok':
            await populateAnalyticsForTiktokProfile(ctx, profile);
            break;
        default:
            console.log(`Platform ${profile.platform} not supported`);
    };
}

module.exports = fetchAnalytics;