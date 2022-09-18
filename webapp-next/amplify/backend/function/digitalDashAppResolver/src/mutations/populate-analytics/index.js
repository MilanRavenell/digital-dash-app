const fetchAnalyticsForIgProProfile = require('./populate-analytics-for-ig-pro-profile');
const populateAnalyticsForTwitterProfile = require('./populate-analytics-for-twitter-profile');
const populateAnalyticsForYtProfile = require('./populate-analytics-for-yt-profile');
const populateAnalyticsForTiktokProfile = require('./populate-analytics-for-tiktok-profile');

async function fetchAnalytics(ctx) {
    const { ddbClient } = ctx.resources;
    const { username, debug_noUploadToDDB } = ctx.arguments.input;

    // Do not fetch posts if it's been less then an hour since posts were last fetched
    try {
        const user = (await ddbClient.get({
            TableName: 'User-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Key: { email: username },
        }).promise()).Item;
    
        const now = new Date();
        const postsLastPopulated = new Date(user.postsLastPopulated);
    
        if (
            (user.postsLastPopulated
            && (now - postsLastPopulated < 3600000))
            && !debug_noUploadToDDB
        ) {
            console.log('Too soon to fetch new data');
            return {
                data: [],
                dataUpdated: false,
                success: true,
            }
        }
    } catch (err) {
        console.error('Failed to fetch user', err);
        return {
            data: [],
            dataUpdated: false,
            success: true,
        }
    }
    
    console.log('Fetching data');

    const profiles = [];
    try {
        profiles.push(...(await ddbClient.query({
            TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            KeyConditionExpression: '#user = :user',
            ExpressionAttributeValues: { ':user': username },
            ExpressionAttributeNames: { '#user': 'user' }
        }).promise())
            .Items);
    } catch (err) {
        console.error(`Failed to fetch profiles for user ${username}`, err);
    }

    try {
        const results = await Promise.all(profiles.map(async (profile) => {
            switch(profile.platform) {
                case 'instagram-pro':
                    let tries = 0;
                    while (tries < 10) {
                        try {
                            return await fetchAnalyticsForIgProProfile(ctx, profile);
                        } catch (err) {
                            tries += 1;
                            // sleep for 2 seconds
                            console.log(`hit timeout, retrying (${tries})`)
                            await new Promise(r => setTimeout(r, 2000));
                        }
                    }
                    
                    console.error('hit instagram retry limit');
                    return [];
                case 'twitter':
                    return await populateAnalyticsForTwitterProfile(ctx, profile);
                case 'youtube':
                    return await populateAnalyticsForYtProfile(ctx, profile);
                case 'tiktok':
                    return [];
                    return await populateAnalyticsForTiktokProfile(ctx, profile);
                default:
                   console.log(`Platform ${profile.platform} not supported`);
                   return [];
            }
        }));

        // Set postsLastPopulated for the user to now
        await ddbClient.update({
            TableName: 'User-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Key: { email: username },
            UpdateExpression: 'SET #postsLastPopulated = :postsLastPopulated',
            ExpressionAttributeNames: { 
                '#postsLastPopulated': 'postsLastPopulated',
            },
            ExpressionAttributeValues: {
                ':postsLastPopulated': new Date().toISOString(),
            },
        }).promise();

        return {
            data: results.flat(),
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
            data: [],
            dataUpdated: false,
            success: false,
        }
    }
}

module.exports = fetchAnalytics;