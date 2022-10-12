const { makeApiRequest } = require('../../shared');

async function fetchAnalyticsForTwitterProfile(ctx, profile, accessToken) {
    const { ddbClient } = ctx.resources;
    const { debug_noUploadToDDB } = ctx.arguments.input;
    const { id } = JSON.parse(profile.meta);

    if (accessToken === null) {
        return;
    } 

    const tweets = [];
    const mediaDict = {};
    let nextToken = null;

    do {
        const response = await makeApiRequest(ctx, profile, `users/${id}/tweets`, accessToken, {
            'tweet.fields': 'id,public_metrics,created_at,attachments',
            'expansions': 'attachments.media_keys',
            'media.fields': 'preview_image_url',
            'max_results': 100,
            'exclude': 'retweets',
            ...(nextToken ? { 'pagination_token': nextToken } : {}),
        });

        if (!response) {
            return [];
        }

        if (response.includes && response.includes.media) {
            response.includes.media.map((media) => {
                mediaDict[media.media_key] = media
            });
        }

        if (response.data !== undefined) {
            tweets.push(...response.data);
        }
        if (response.meta !== undefined) {
            nextToken = response.meta.next_token;
        }
    } while (nextToken !== undefined)

    const tweetsDict = tweets.reduce((acc, tweet) => {
        acc[tweet.id] = tweet;
        return acc;
    }, {});

    nextToken = null;
    do {
        const organicMetricsResponse = await makeApiRequest(ctx, profile, `users/${id}/tweets`, accessToken, {
            'tweet.fields': 'id,organic_metrics',
            'max_results': 100,
            'exclude': 'retweets',
            ...(nextToken ? { 'pagination_token': nextToken } : {}),
        });
    
        if (organicMetricsResponse && organicMetricsResponse.data) {
            organicMetricsResponse.data.forEach((tweet) => {
                tweetsDict[tweet.id].organic_metrics = tweet.organic_metrics;
            });
        }

        if (organicMetricsResponse.meta) {
            nextToken = organicMetricsResponse.meta.next_token;
        }
    } while (nextToken !== undefined)

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

        const engagementCount = (user_profile_clicks || 0) + like_count + reply_count + retweet_count;

        let item = {
            id: tweet.id,
            profileName: profile.profileName,
            datePosted: tweet.created_at,
            caption: tweet.text,
            link: `https://twitter.com/${profile.profileName}/status/${tweet.id}`,
            media,
            viewCount: impression_count,
            engagementCount,
            engagementRate: (impression_count && impression_count > 0) ? engagementCount / parseFloat(impression_count) : null,
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
        } else {
            console.log(item)
        }

        return item;
    }));

    return items;
}

module.exports = fetchAnalyticsForTwitterProfile;