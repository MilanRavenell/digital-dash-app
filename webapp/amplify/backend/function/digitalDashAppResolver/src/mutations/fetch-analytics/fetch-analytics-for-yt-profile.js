const axios = require("axios");

async function fetchAnalyticsForYtProfile(ctx, profile) {
    const { ddbClient } = ctx.resources;
    const { id, accessToken } = JSON.parse(profile.meta);

    const videos = [];
    let playlistItemUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${id}&access_token=${accessToken}`;

    do {
        const response = await axios.get(playlistItemUrl)
        videos.push(...response.data.items);
        //TODO: Figure out paging
        playlistItemUrl = undefined;
        // url = response.data.paging.next;
    } while (playlistItemUrl !== undefined)

    const videoIds = videos.reduce((acc, { contentDetails }, index, array) => {
        acc += contentDetails.videoId;
        if (index !== array.length - 1) {
            acc += ','
        }
        return acc;
    }, '');

    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&access_token=${accessToken}`;
    const response = await axios.get(videosUrl);
    const now = new Date().toISOString();
    await Promise.all(response.data.items.map(async (video) => {
        console.log(video)

        let item = {
            id: video.id,
            profileName: profile.profileName,
            caption: video.snippet.title,
            viewCount: parseInt(video.statistics.viewCount),
            commentCount: parseInt(video.statistics.commentCount),
            likeCount: parseInt(video.statistics.likeCount),
            dislikeCount: parseInt(video.statistics.dislikeCount),
            link: `https://youtube.com/watch?v=${video.id}`,
            engagementCount: parseInt(video.statistics.commentCount) + parseInt(video.statistics.likeCount) + parseInt(video.statistics.favoriteCount),
            favoriteCount: parseInt(video.statistics.favoriteCount),
            datePosted: video.snippet.publishedAt,
            createdAt: now,
            updatedAt: now,
            __typename: 'YoutubePost',
        };

        await ddbClient.put({
            TableName: 'YoutubePost-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            Item: item
        }).promise();
    }));
}

module.exports = fetchAnalyticsForYtProfile;