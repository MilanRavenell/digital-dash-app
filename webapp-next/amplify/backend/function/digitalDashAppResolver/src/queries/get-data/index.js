const { getBeefedUserProfiles } = require('../shared');

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

    const profiles = await getBeefedUserProfiles(ctx, username);
    const records = await getRecords(ctx, profiles);
    
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

async function getRecords(ctx, profiles) {
    const { ddbClient } = ctx.resources;
    
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
        console.error(`Failed to fetch records for user`, err);
    }

    records.sort((a, b) => {
        return (new Date(b.datePosted) - new Date(a.datePosted))
    });

    return records;
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

module.exports = getData;