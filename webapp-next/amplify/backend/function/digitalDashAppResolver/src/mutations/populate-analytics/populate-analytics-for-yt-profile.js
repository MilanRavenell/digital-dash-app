const axios = require("axios");
const { makeApiRequest } = require('../../shared');

async function fetchAnalyticsForYtProfile(ctx, profile, accessToken) {
    const { ddbClient } = ctx.resources;
    const { uploadsId: id } = JSON.parse(profile.meta);
    const { debug_noUploadToDDB } = ctx.arguments.input;

    if (accessToken === null) {
        return;
    } 

    const videos = [];
    let nextToken = null;

    do {
        const response = await makeApiRequest(ctx, profile, 'playlistItems', accessToken, {
            'part': 'contentDetails',
            'playlistId': id,
            'maxResults': 50,
            ...(nextToken ? { 'pageToken': nextToken } : {}),
        });

        if (!response) {
            return [];
        }
        videos.push(...response.items);
        console.log(response)

        nextToken = response.nextPageToken ?? null;

    } while (nextToken !== null)

    const videoIds = videos.reduce((acc, { contentDetails }, index, array) => {
        acc += contentDetails.videoId;
        if (index !== array.length - 1) {
            acc += ','
        }
        return acc;
    }, '');

    const response = await makeApiRequest(ctx, profile, 'videos', accessToken, {
        'part': 'snippet,statistics',
        'id': videoIds,
    });

    if (!response) {
        return [];
    }

    const now = new Date().toISOString();

    const items = await Promise.all(response.items.map(async (video) => {
        const viewCount = parseInt(video.statistics.viewCount);
        const commentCount = parseInt(video.statistics.commentCount);
        const likeCount = parseInt(video.statistics.likeCount);
        const favoriteCount = parseInt(video.statistics.favoriteCount);
        const engagementCount = commentCount + likeCount + favoriteCount;

        const item = {
            id: video.id,
            profileName: profile.profileName,
            caption: video.snippet.title,
            media: [{
                thumbnailUrl: video.snippet.thumbnails.default.url,
                type: 'video',
            }],
            viewCount,
            commentCount,
            likeCount,
            dislikeCount: parseInt(video.statistics.dislikeCount),
            link: `https://youtube.com/watch?v=${video.id}`,
            engagementCount,
            engagementRate: (viewCount > 0) ? engagementCount / parseFloat(viewCount) : null,
            favoriteCount,
            datePosted: video.snippet.publishedAt,
            createdAt: now,
            updatedAt: now,
            __typename: 'YoutubePost',
        };

        if (!debug_noUploadToDDB) {
            await ddbClient.put({
                TableName: 'YoutubePost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                Item: item
            }).promise();
        }

        return item;
    }));

    return items;
}

module.exports = fetchAnalyticsForYtProfile;