const getGraphData = require('./get-graph-data');
const getAggregatedStats = require('./get-aggregated-stats');
const { getBeefedUserProfiles } = require('../../shared');

const platformTableMap = Object.freeze({
    'twitter': 'TwitterPost',
    'youtube': 'YoutubePost',
    'instagram-pro': 'InstagramPost',
    'instagram-basic': 'InstagramPost',
});

// Must be reverse ordered chronologically
const now = new Date();
const timeframes = [
    {
        name: 'Past Week',
        endDate: now.toISOString(),
        startDate: new Date(new Date().setDate(now.getDate() - 7)).toISOString(),
    },
    {
        name: 'Past Month',
        endDate: now.toISOString(),
        startDate: new Date(new Date().setDate(now.getDate() - 30)).toISOString(),
    },
    {
        name: 'Past Year',
        endDate: now.toISOString(),
        startDate: new Date(new Date().setDate(now.getDate() - 365)).toISOString(),
    },
    { name: 'Custom' }
];

const metrics = [
    { displayName: 'Views', field: 'viewCount'},
    { displayName: 'Engagment', field: 'engagementCount' }
];

async function getData(ctx) {
    const { username, selectedProfileNames } = ctx.arguments.input;
    const { startDate, endDate } = ctx.arguments.input.startDate ? ctx.arguments.input : timeframes[0];

    const profiles = await getBeefedUserProfiles(ctx, username);
    const filteredProfiles = selectedProfileNames
        ? profiles.filter(({ profileName }) => (selectedProfileNames.includes(profileName)))
        : profiles;
    const records = await getRecords(ctx, filteredProfiles, startDate, endDate);
    
    return {
        data: {
            profiles,
            graph: getGraphData(records, startDate, endDate),
            aggregated: getAggregatedStats(records, metrics, filteredProfiles),
            records,
            timeframes,
            postHeaders: [
                {
                    platform: 'global',
                    metrics: [
                        { displayName: 'Platform', field: '__typename'},
                        { displayName: 'Profile', field: 'profileName'},
                        { displayName: 'Date', field: 'datePosted'},
                        { displayName: 'Caption', field: 'caption'},
                        { displayName: 'Views', field: 'viewCount'},
                        { displayName: 'Total Engagement', field: 'engagementCount'},
                    ],
                },
                {
                    platform: 'twitter',
                    metrics: [
                        { displayName: 'Profile Clicks', field: 'profileClickCount'},
                        { displayName: 'Likes', field: 'likeCount'},
                        { displayName: 'Replies', field: 'replyCount'},
                        { displayName: 'Retweets', field: 'retweetCount'},
                    ],
                },
                {
                    platform: 'youtube',
                    metrics: [
                        { displayName: 'Likes', field: 'likeCount'},
                        { displayName: 'Comments', field: 'commentCount'},
                    ]
                },
                {
                    platform: 'instagram-pro',
                    metrics: [
                        { displayName: 'Likes', field: 'likeCount'},
                        { displayName: 'Comments', field: 'commentCount'},
                        { displayName: 'Saves', field: 'saveCount'},
                        { displayName: 'Reach', field: 'reachCount'},
                    ]
                },
            ]
        },
        success: true,
    };
}

async function getRecords(ctx, profiles, startDate, endDate) {
    const { ddbClient } = ctx.resources;
    
    const records = [];
    try {
        records.push(...(await Promise.all(
            profiles
                .map(async (profile) => {
                    const platform = platformTableMap[profile.platform];
                    if (platform === undefined) {
                        return [];
                    }
                    
                    const items = (await ddbClient.query({
                        TableName: `${platform}-7hdw3dtfmbhhbmqwm7qi7fgbki-staging`,
                        IndexName: 'ByProfileName',
                        KeyConditionExpression: '#profileName = :profileName AND #datePosted BETWEEN :start AND :end',
                        ExpressionAttributeValues: {
                            ':profileName': profile.profileName,
                            ':start': startDate,
                            ':end': endDate,
                        },
                        ExpressionAttributeNames: {
                            '#profileName': 'profileName',
                            '#datePosted': 'datePosted',
                        }
                    }).promise())
                        .Items;

                    return items;
                })
            ))
            .flat())
    } catch (err) {
        console.error(`Failed to fetch records for user`, err);
    }

    records.sort((a, b) => {
        return (new Date(b.datePosted) - new Date(a.datePosted))
    });

    return records;
}

module.exports = getData;