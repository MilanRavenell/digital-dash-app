const fetchAnalyticsForIgProfile = require('./fetch-analytics-for-ig-profile');
const fetchAnalyticsForTwitterProfile = require('./fetch-analytics-for-twitter-profile');
const fetchAnalyticsForYtProfile = require('./fetch-analytics-for-yt-profile');

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
                    return;
                    return await fetchAnalyticsForIgProfile(ctx, profile);
                case 'twitter':
                    return;
                    return await fetchAnalyticsForTwitterProfile(ctx, profile);
                case 'youtube':
                    return await fetchAnalyticsForYtProfile(ctx, profile);
                default:
                    throw new Error(`Platform ${profile.platform} not supported`);
            }
        }));

        return true
    } catch (err) {
        console.error(`Failed to fetch analytics for user ${username}`, err);
        return false;
    }
}

module.exports = fetchAnalytics;