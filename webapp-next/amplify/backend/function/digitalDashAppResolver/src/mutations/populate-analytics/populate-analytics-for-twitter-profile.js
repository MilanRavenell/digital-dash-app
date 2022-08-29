const axios = require("axios");
const Twitter = require('twitter-lite');
const { getAccessToken } = require('../../shared');

async function fetchAnalyticsForTwitterProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;
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

    //TODO: iterate over next tokens
    const response = await client.get(`users/${id}/tweets`, {
        'tweet.fields': 'id,public_metrics,created_at,attachments',
        'expansions': 'attachments.media_keys',
        'media.fields': 'preview_image_url',
        'max_results': 100,
        'exclude': 'retweets', 
    });

    if (response.data === undefined) {
        return;
    }

    const tweetsDict = response.data.reduce((acc, tweet) => {
        acc[tweet.id] = tweet;
        return acc;
    }, {});

    const mediaDict = {};
    if (response.includes && response.includes.media) {
        response.includes.media.map((media) => {
            mediaDict[media.media_key] = media
        });
    }

    const organicMetricsResponse = await client.get(`users/${id}/tweets`, {
        'tweet.fields': 'id,organic_metrics',
        'max_results': 100,
        'exclude': 'retweets', 
    });

    if (organicMetricsResponse.data === undefined) {
        return;
    }

    organicMetricsResponse.data.forEach((tweet) => {
        tweetsDict[tweet.id].organic_metrics = tweet.organic_metrics;
    });
    
    const now = new Date().toISOString();
    const items = await Promise.all(Object.values(tweetsDict).map(async (tweet) => {
        const { like_count, reply_count, retweet_count } = tweet.public_metrics;
        const { impression_count, user_profile_clicks } = tweet.organic_metrics || {};
        const media = [];
        if (tweet.attachments && tweet.attachments.media_keys) {
            media.push(
                ...tweet.attachments.media_keys.map((media_key) => {
                    const media = mediaDict[media_key];

                    if (media.preview_image_url && media.type) {
                        return { 
                            thumbnailUrl: mediaDict[media_key].preview_image_url,
                            type: mediaDict[media_key].type,
                        }
                    }
                    
                    return null;
                })
                    .filter(media => (media !== null))
            )
        }

        let item = {
            id: tweet.id,
            profileName: profile.profileName,
            datePosted: tweet.created_at,
            caption: tweet.text,
            link: `https://twitter.com/${profile.profileName}/status/${tweet.id}`,
            media,
            viewCount: impression_count,
            engagementCount: (user_profile_clicks || 0) + like_count + reply_count + retweet_count,
            profileClickCount: user_profile_clicks,
            likeCount: like_count,
            replyCount: reply_count,
            retweetCount: retweet_count,
            createdAt: now,
            updatedAt: now,
            __typename: 'TwitterPost',
        };

        if (!debug_noUploadToDDB) {
            await ddbClient.put({
                TableName: 'TwitterPost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Item: item
            }).promise();
        }

        return item;
    }));

    return items;
}

module.exports = fetchAnalyticsForTwitterProfile;