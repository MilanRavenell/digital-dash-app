const platformTableMap = Object.freeze({
    'twitter': 'TwitterPost',
    'youtube': 'YoutubePost',
    'instagram': 'InstagramPost',
});

// Must be reverse ordered chronologically
const timeframes = [
    { name: 'day', nDays: 1 },
    { name: 'month', nDays: 30 },
    { name: 'year', nDays: 365 },
    { name: 'all time' }
];

const metrics = [
    { displayName: 'Views', field: 'viewCount'},
    { displayName: 'Engagment', field: 'engagementCount' }
];

async function getData(ctx) {
    const { username } = ctx.arguments.input;

    const { records, profiles } = await getRecords(ctx, username);

    return {
        data: {
            profiles,
            timeframes: timeframes.map(timeframe => ({
                name: timeframe.name,
                partitionDate: getDatePartitions(timeframe.nDays),
                graphPartitions: getGraphPartitionsFromTimeframe(timeframe.name)
            })),
            metrics,
            records,
            postHeaders: [
                {
                    platform: 'global',
                    metrics: [
                        { displayName: 'Platform', field: '__typename'},
                        { displayName: 'Caption', field: 'caption'},
                        { displayName: 'Views', field: 'viewCount'},
                        { displayName: 'Total Engagement', field: 'engagementCount'},
                        { displayName: 'Date', field: 'datePosted'},
                    ],
                },
                {
                    platform: 'twitter',
                    metrics: [
                        { displayName: 'Caption', field: 'caption'},
                        { displayName: 'Views', field: 'viewCount'},
                        { displayName: 'Profile Clicks', field: 'profileClickCount'},
                        { displayName: 'Likes', field: 'likeCount'},
                        { displayName: 'Detail Expands', field: 'detailExpandCount'},
                        { displayName: 'Media Engagements', field: 'mediaEngagementCount'},
                        { displayName: 'Replies', field: 'replyCount'},
                        { displayName: 'Date', field: 'datePosted'},
                    ],
                },
                {
                    platform: 'youtube',
                    metrics: [
                        { displayName: 'Caption', field: 'caption'},
                        { displayName: 'Views', field: 'viewCount'},
                        { displayName: 'Likes', field: 'likeCount'},
                        { displayName: 'Comments', field: 'commentCount'},
                        { displayName: 'Date', field: 'datePosted'},
                    ]
                },
                {
                    platform: 'instagram',
                    metrics: [
                        { displayName: 'Caption', field: 'caption'},
                        { displayName: 'Views', field: 'viewCount'},
                        { displayName: 'Likes', field: 'likeCount'},
                        { displayName: 'Comments', field: 'commentCount'},
                        { displayName: 'Saves', field: 'saveCount'},
                        { displayName: 'Reach', field: 'reachCount'},
                        { displayName: 'Date', field: 'datePosted'},
                    ]
                },
            ]
        },
        success: true,
    };
}

async function getRecords(ctx, username) {
    const { ddbClient } = ctx.resources;

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
    
    const records = [];
    try {
        records.push(...(await Promise.all(profiles.map(async (profile) => {
            const items = (await ddbClient.query({
                TableName: `${platformTableMap[profile.platform]}-7hdw3dtfmbhhbmqwm7qi7fgbki-staging`,
                IndexName: 'ByProfileName',
                KeyConditionExpression: '#profileName = :profileName',
                ExpressionAttributeValues: { ':profileName': profile.profileName },
                ExpressionAttributeNames: { '#profileName': 'profileName' }
            }).promise())
                .Items;

            return items
        })))
            .flat())
    } catch (err) {
        console.error(`Failed to fetch records for user ${username}`, err);
    }

    records.sort((a, b) => {
        return (new Date(b.datePosted) - new Date(a.datePosted))
    });

    return { records, profiles };
}

function getGraphPartitionsFromTimeframe(timeframe) {
    const date = new Date();
    date.setMinutes(0, 0, 0)
    const partitions = [];

    switch(timeframe){
        case 'day':
            for (let i = 0; i < 24; i++) {
                date.setHours(date.getHours() - 1);
                partitions.push(date.toISOString())
            }
            break;
        case 'month':
            date.setHours(0);
            for (let i = 0; i < 30; i++) {
                date.setDate(date.getDate() - 1);
                partitions.push(date.toISOString())
            }
            break;
        case 'year':
        case 'all time':
            date.setHours(0);
            date.setDate(0);
            for (let i = 0; i < 12; i++) {
                date.setMonth(date.getMonth() - 1);
                partitions.push(date.toISOString())
            }
            break;
    };

    return partitions;
}

function getDatePartitions(nDays) {
    if (nDays === undefined) {
        return null;
    };

    const date = new Date();
    date.setDate(date.getDate() - nDays);
    return date;
}

function formatRecord(record) {
    switch(record.platform) {
        case 'twitter':
            return {
                'Platform': 'twitter',
                'Link': `https://www.twitter.com/${record.profileName}/status/${record.id}`,
                'Views': record.viewCount || 0,
                'Total Engagement': record.profileClickCount + record.likeCount + record.detailExpandCount + record.mediaEngagementCount + record.replyCount,
                'Profile Clicks': record.profileClickCount || 0,
                'Likes': record.likeCount || 0,
                'Detail Expands': record.detailExpandCount || 0,
                'Media Engagements': record.mediaEngagementCount || 0,
                'Replies': record.replyCount || 0,
                'Date': record.datePosted || 0,
                'Caption': record.caption || '',
            };
        case 'youtube':
            return {
                'Platform': 'youtube',
                'Link': `https://www.youtube.com${record.id}`,
                'Views': record.viewCount,
                'Total Engagement': record.likeCount + record.commentCount,
                'Likes': record.likeCount,
                'Comments': record.commentCount,
                'Date': record.datePosted,
                'Caption': record.caption || '',
            };
        case 'instagram':
            return {
                'Platform': 'instagram',
                'Link': `https://www.youtube.com${record.id}`,
                'Views': record.viewCount,
                'Total Engagement': record.likeCount + record.commentCount,
                'Likes': record.likeCount,
                'Comments': record.commentCount,
                'Date': record.datePosted,
                'Caption': record.caption || '',
            };
    }
}

module.exports = getData;