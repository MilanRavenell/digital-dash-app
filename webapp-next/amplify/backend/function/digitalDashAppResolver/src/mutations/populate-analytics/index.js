const populateAnalyticsForIgProfile = require('./populate-analytics-for-ig-profile');
const populateAnalyticsForTwitterProfile = require('./populate-analytics-for-twitter-profile');
const populateAnalyticsForYtProfile = require('./populate-analytics-for-yt-profile');

async function fetchAnalytics(ctx) {
    const { ddbClient } = ctx.resources;
    const { username } = ctx.arguments.input;

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
                case 'instagram':
                    const tries = 0;
                    while (tries < 5) {
                        try {
                            return await populateAnalyticsForIgProfile(ctx, profile);
                        } catch (err) {
                            tries += 1;
                            // sleep for 2 seconds
                            console.log(`hit timeout, retrying (${tries})`)
                            await new Promise(r => setTimeout(r, 2000));
                        }
                    }
                    
                    throw new Error('hit instagram retry limit');
                case 'twitter':
                    return await populateAnalyticsForTwitterProfile(ctx, profile);
                case 'youtube':
                    return await populateAnalyticsForYtProfile(ctx, profile);
                default:
                    throw new Error(`Platform ${profile.platform} not supported`);
            }
        }));

        return {
            data: results.flat(),
            success: true,
        }
    } catch (err) {
        console.error(`Failed to fetch analytics for user ${username}`, err);
        return {
            data: [],
            success: false,
        }
    }
}

module.exports = fetchAnalytics;