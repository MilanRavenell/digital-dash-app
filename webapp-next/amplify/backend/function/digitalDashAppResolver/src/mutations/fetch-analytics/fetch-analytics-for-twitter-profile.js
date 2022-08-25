const axios = require("axios");
const Twitter = require('twitter-lite');
const { getAccessToken } = require('../../shared');

async function fetchAnalyticsForTwitterProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { id } = JSON.parse(profile.meta);

    const accessToken = await getAccessToken(ctx, profile);
    if (accessToken === null) {
        return;
    } 

    const client = new Twitter({
        consumer_key: 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ',
        consumer_secret: 'FaIS5ICp0qvbrRO30zSvngjZLyVU8VEY4V0lsklrsvu0CkK384',
        bearer_token: accessToken,
        version: '2',
        extension: false,
    });

    try {
        const response = await client.get(`users/${id}/tweets`, {
            'tweet.fields': 'id,organic_metrics,created_at',
            'max_results': 100,
            'exclude': 'retweets', 
        });

        if (response.data === undefined) {
            return;
        }

        const now = new Date().toISOString();
        await Promise.all(response.data.map(async (tweet) => {
            let item = {
                id: tweet.id,
                profileName: profile.profileName,
                datePosted: tweet.created_at,
                caption: tweet.text,
                link: `https://twitter.com/${profile.profileName}/status/${tweet.id}`,
                viewCount: tweet.organic_metrics.impression_count,
                engagementCount: tweet.organic_metrics.user_profile_clicks + tweet.organic_metrics.like_count + tweet.organic_metrics.reply_count + tweet.organic_metrics.retweet_count,
                profileClickCount: tweet.organic_metrics.user_profile_clicks,
                likeCount: tweet.organic_metrics.like_count,
                replyCount: tweet.organic_metrics.reply_count,
                retweetCount: tweet.organic_metrics.retweet_count,
                createdAt: now,
                updatedAt: now,
                __typename: 'TwitterPost',
            };

            await ddbClient.put({
                TableName: 'TwitterPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Item: item
            }).promise();
        }));
    } catch (err) {
        console.log(`Failed to fetch tweets for user${profile.profileName}`, err);
    }
}

module.exports = fetchAnalyticsForTwitterProfile;