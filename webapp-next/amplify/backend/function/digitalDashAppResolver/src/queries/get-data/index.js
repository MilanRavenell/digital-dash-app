const moment = require('moment');
const getGraphData = require('./get-graph-data');
const getAggregatedStats = require('./get-aggregated-stats');
const { getProfiles } = require('../../shared');

const platformTableMap = Object.freeze({
    'twitter': 'TwitterPost',
    'youtube': 'YoutubePost',
    'instagram-pro': 'InstagramPost',
    'instagram-basic': 'InstagramPost',
    'tiktok': 'TiktokPost',
});

// Must be reverse ordered chronologically
const now = new Date();

const timeframes = (timezoneOffset) => {
    const nowTimezone = getDateWithTimezoneOffset(now, timezoneOffset);

    const zerodOut = new Date(nowTimezone);
    zerodOut.setHours(0, 0, 0, 0);

    const weekAgo = new Date(zerodOut.getTime() - (6 * 24 * 60 * 60 * 1000));
    const monthAgo = new Date(zerodOut.getTime() - (29 * 24 * 60 * 60 * 1000));
    const yearAgo = new Date(zerodOut.getTime() - (364 * 24 * 60 * 60 * 1000));


    return [
        {
            name: 'Past Week',
            endDate: nowTimezone.toISOString(),
            startDate: weekAgo.toISOString(),
        },
        {
            name: 'Past Month',
            endDate: nowTimezone.toISOString(),
            startDate: monthAgo.toISOString(),
        },
        {
            name: 'Past Year',
            endDate: nowTimezone.toISOString(),
            startDate: yearAgo.toISOString(),
        },
        { name: 'Custom' }
    ]
};

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
        platform: 'instagram-basic',
        metrics: [
            { displayName: 'Likes', field: 'likeCount'},
            { displayName: 'Comments', field: 'commentCount'},
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
    const { owner, selectedProfileNames, timezoneOffset=0 } = ctx.arguments.input;
    const { startDate, endDate } = ctx.arguments.input.startDate ? ctx.arguments.input : timeframes(timezoneOffset)[0];

    const profiles = await getProfiles(ctx, owner);

    if (profiles === null) {
        return {
            success: false,
            data: {}
        }
    }

    const filteredProfiles = selectedProfileNames
        ? profiles.filter(({ profileName }) => (selectedProfileNames.includes(profileName)))
        : profiles;
    const records = await getRecords(ctx, filteredProfiles, startDate, endDate, timezoneOffset);

    const previousComparisonTimeframe = getPreviousComparisonTimeframe(startDate, endDate);
    const previousComparisonRecords = await getRecords(ctx, filteredProfiles, previousComparisonTimeframe[0], previousComparisonTimeframe[1], timezoneOffset);

    const aggregatedCurrent = await getAggregatedStats(ctx, records, metrics, filteredProfiles, endDate, timezoneOffset);
    const aggregatedPrevious = await getAggregatedStats(ctx, previousComparisonRecords, metrics, filteredProfiles, previousComparisonTimeframe[1], timezoneOffset);

    const aggregated = {
        previousComparisonTimeframeStart: previousComparisonTimeframe[0],
        previousComparisonTimeframeEnd: previousComparisonTimeframe[1],
        stats: aggregatedCurrent.map((stat, index) => {
            const prevValue = parseFloat(aggregatedPrevious[index].value.replace(/[^0-9.]/g, ''));
            const curValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
            const percentDiff = (prevValue === 0) ? null : (curValue - prevValue) / prevValue;
    
            return {
                ...stat,
                percentDiff,
            }
        }),
    };

    const graphs = await getGraphData(ctx, records, filteredProfiles, startDate, endDate, timezoneOffset);
    
    return {
        data: {
            graphs,
            aggregated,
            records,
            timeframes: timeframes(timezoneOffset),
            postHeaders,
        },
        success: true,
    };
}

async function getRecords(ctx, profiles, startDate, endDate, timezoneOffset) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    // Get UTC dates
    const startUTC = getDateWithTimezoneOffset(startDate, -1 * timezoneOffset);
    const endUTC = getDateWithTimezoneOffset(endDate, -1 * timezoneOffset);
    
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
                        TableName: `${platform}-${appsync_api_id}-${env}`,
                        IndexName: 'ByProfileName',
                        KeyConditionExpression: '#profileName = :profileName AND #datePosted BETWEEN :start AND :end',
                        ExpressionAttributeValues: {
                            ':profileName': profile.profileName,
                            ':start': startUTC.toISOString(),
                            ':end': endUTC.toISOString(),
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