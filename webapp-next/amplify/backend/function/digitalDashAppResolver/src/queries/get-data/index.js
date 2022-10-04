const moment = require('moment');
const getGraphData = require('./get-graph-data');
const getAggregatedStats = require('./get-aggregated-stats');

const platformTableMap = Object.freeze({
    'twitter': 'TwitterPost',
    'youtube': 'YoutubePost',
    'instagram-pro': 'InstagramPost',
    'instagram-basic': 'InstagramPost',
    'tiktok': 'TiktokPost',
});

// Must be reverse ordered chronologically
const now = new Date();
const timeframes = (timezoneOffset) => ([
    {
        name: 'Past Week',
        endDate: getDateWithTimezoneOffset(now, timezoneOffset).toISOString(),
        startDate: getDateWithTimezoneOffset(new Date(new Date().setDate(now.getDate() - 6)), timezoneOffset).toISOString(),
    },
    {
        name: 'Past Month',
        endDate: getDateWithTimezoneOffset(now, timezoneOffset).toISOString(),
        startDate: getDateWithTimezoneOffset(new Date(new Date().setDate(now.getDate() - 29)), timezoneOffset).toISOString(),
    },
    {
        name: 'Past Year',
        endDate: getDateWithTimezoneOffset(now, timezoneOffset).toISOString(),
        startDate: getDateWithTimezoneOffset(new Date(new Date().setDate(now.getDate() - 364)), timezoneOffset).toISOString(),
    },
    { name: 'Custom' }
]);

const metrics = [
    { displayName: 'Views', field: 'viewCount'},
    { displayName: 'Engagement', field: 'engagementCount' }
];

const postHeaders = [
    {
        platform: 'global',
        metrics: [
            { displayName: 'Platform', field: '__typename'},
            { displayName: 'Profile', field: 'profileName'},
            { displayName: 'Caption', field: 'caption'},
            { displayName: 'Date', field: 'datePosted'},
            { displayName: 'Views', field: 'viewCount'},
            { displayName: 'Total Engagement', field: 'engagementCount'},
            { displayName: 'Engagement Rate', field: 'engagementRate'},
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
    {
        platform: 'tiktok',
        metrics: [
            { displayName: 'Likes', field: 'likeCount'},
            { displayName: 'Comments', field: 'commentCount'},
            { displayName: 'Shares', field: 'shareCount'},
        ]
    },
]

async function getData(ctx) {
    const { username, selectedProfileNames, timezoneOffset=0 } = ctx.arguments.input;
    const { startDate, endDate } = ctx.arguments.input.startDate ? ctx.arguments.input : timeframes(timezoneOffset)[0];

    const profiles = await gertProfiles(ctx, username);
    const filteredProfiles = selectedProfileNames
        ? profiles.filter(({ profileName }) => (selectedProfileNames.includes(profileName)))
        : profiles;
    const records = await getRecords(ctx, filteredProfiles, startDate, endDate, timezoneOffset);

    const previousComparisonTimeframe = getPreviousComparisonTimeframe(startDate, endDate);
    console.log(startDate, endDate)
    console.log(previousComparisonTimeframe)
    const previousComparisonRecords = await getRecords(ctx, filteredProfiles, previousComparisonTimeframe[0], previousComparisonTimeframe[1], timezoneOffset);

    const aggregatedCurrent = await getAggregatedStats(ctx, records, metrics, filteredProfiles, endDate, timezoneOffset);
    const aggregatedPrevious = await getAggregatedStats(ctx, previousComparisonRecords, metrics, filteredProfiles, previousComparisonTimeframe[1], timezoneOffset);

    const aggregated = aggregatedCurrent.map((stat, index) => {
        const prevValue = parseFloat(aggregatedPrevious[index].value.replace(/[^0-9.]/g, ''));
        const curValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
        const percentDiff = (prevValue === 0) ? null : (curValue - prevValue) / prevValue;

        return {
            ...stat,
            percentDiff,
        }
    });
    
    return {
        data: {
            profiles,
            graphs: await getGraphData(ctx, records, profiles, startDate, endDate, timezoneOffset),
            aggregated,
            records,
            timeframes: timeframes(timezoneOffset),
            postHeaders,
        },
        success: true,
    };
}

async function gertProfiles(ctx, username) {
    const { ddbClient } = ctx.resources;

    try {
        return (await ddbClient.query({
            TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
            KeyConditionExpression: '#user = :user',
            ExpressionAttributeValues: { ':user': username },
            ExpressionAttributeNames: { '#user': 'user' }
        }).promise())
            .Items;
    } catch (err) {
        console.error('Failed to fetch user profiles', err);
        return [];
    }
    
}

async function getRecords(ctx, profiles, startDate, endDate, timezoneOffset) {
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

                    return items.map(item => ({
                        ...item,
                        datePosted: getDateWithTimezoneOffset(item.datePosted, timezoneOffset).toISOString(),
                    }));
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

function getDateWithTimezoneOffset(date, timezoneOffset) {
    return new Date(new Date(date) - (timezoneOffset * 60 * 1000));
}

function getPreviousComparisonTimeframe(start, end) {
    nDays = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
    newEnd = moment(start).subtract(1, 'days')
    newStart = moment(newEnd).subtract(nDays, 'days');

    return [newStart.toISOString(), newEnd.toISOString()]
}

module.exports = getData;