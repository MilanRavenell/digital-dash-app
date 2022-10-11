const moment = require('moment');
const Rainbow = require('rainbowvis.js');

const graphColors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#00ffff',
    '#ff00ff',
    '#ff7700',
    '#ff0077',
    '#bb00ff',
]

async function getGraphData(ctx, records, profiles, start, end, timezoneOffset) {
    const partitions = getGraphPartitions(start, end);
    const followerHistory = await getFollowerHistory(ctx, profiles, start, end, timezoneOffset);

    const totalViewsPartitoned = partitions.map(() => 0);
    const totalEngagementPartitioned = partitions.map(() => 0);

    const profileViewsPartitioned = profiles.reduce((acc, { profileName }) => ({
        ...acc,
        [profileName]: partitions.map(() => 0),
    }), {});

    const profileEngagementPartitioned = profiles.reduce((acc, { profileName }) => ({
        ...acc,
        [profileName]: partitions.map(() => 0),
    }), {});

    const profileEngagementRatePartitioned = profiles.reduce((acc, { profileName }) => ({
        ...acc,
        [profileName]: partitions.map(() => 0),
    }), {});

    const profileFollowerCountPartitioned = profiles.reduce((acc, { profileName }) => ({
        ...acc,
        [profileName]: partitions.map(() => 0),
    }), {});

    let recordIndex = 0;
    partitions.forEach((partition, partitionIndex) => {
        while ((recordIndex < records.length) && (new Date(records[recordIndex].datePosted) > new Date(partition))) {
            const record = records[recordIndex];
            totalViewsPartitoned[partitionIndex] += parseInt(record.viewCount || 0);
            totalEngagementPartitioned[partitionIndex] += parseInt(record.engagementCount || 0);

            profileViewsPartitioned[record.profileName][partitionIndex] += parseInt(record.viewCount || 0);
            profileEngagementPartitioned[record.profileName][partitionIndex] += parseInt(record.engagementCount || 0);

            ++recordIndex;
        }

        profiles.forEach(({ profileName }, profileIndex) => {
            if (profileViewsPartitioned[profileName][partitionIndex] > 0) {
                profileEngagementRatePartitioned[profileName][partitionIndex] = 
                    parseFloat(profileEngagementPartitioned[profileName][partitionIndex])
                    / profileViewsPartitioned[profileName][partitionIndex];
            }

            const followerHistoryFiltered = followerHistory[profileIndex]
                .filter(history => {
                    partitionDate = new Date(partition);
                    historyDate = new Date(history.createdAt)

                    return (
                        historyDate.getFullYear() === partitionDate.getFullYear()
                        && historyDate.getMonth() === partitionDate.getMonth()
                        && historyDate.getDate() === partitionDate.getDate()
                    )
                });

            if (followerHistoryFiltered.length > 0) {
                // Force amplpify push
                profileFollowerCountPartitioned[profileName][partitionIndex] = (followerHistoryFiltered[0].value || 0);
            }
        });
    });

    partitions.reverse();

    return [
        {
            name: 'Total Views and Engagement',
            type: 'bar',
            graph: {
                labels: partitions
                    .map(partition => moment(partition).format('MMM D, YYYY')),
                datasets: [
                    {
                        label: 'Views',
                        data: totalViewsPartitoned.reverse(),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                    },
                    {
                        label: 'Engagement',
                        data: totalEngagementPartitioned.reverse(),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                    },
                ],
            },
        },
        {
            name: 'Views',
            type: 'line',
            graph: {
                labels: partitions
                    .map(partition => moment(partition).format('MMM D, YYYY')),
                datasets: profiles.map(({ profileName }, index) => ({
                    label: profileName,
                    data: profileViewsPartitioned[profileName].reverse(),
                    borderColor: graphColors[index],
                    backgroundColor: graphColors[index],
                })),
            },
        },
        {
            name: 'Engagement',
            type: 'line',
            graph: {
                labels: partitions
                    .map(partition => moment(partition).format('MMM D, YYYY')),
                datasets: profiles.map(({ profileName }, index) => ({
                    label: profileName,
                    data: profileEngagementPartitioned[profileName].reverse(),
                    borderColor: graphColors[index],
                    backgroundColor: graphColors[index],
                })),
            },
        },
        {
            name: 'Engagement Rate',
            type: 'line',
            graph: {
                labels: partitions
                    .map(partition => moment(partition).format('MMM D, YYYY')),
                datasets: profiles.map(({ profileName }, index) => ({
                    label: profileName,
                    data: profileEngagementRatePartitioned[profileName].reverse(),
                    borderColor: graphColors[index],
                    backgroundColor: graphColors[index],
                })),
            },
        },
        {
            name: 'Follower Count',
            type: 'line',
            graph: {
                labels: partitions
                    .map(partition => moment(partition).format('MMM D, YYYY')),
                datasets: profiles.map(({ profileName }, index) => ({
                    label: profileName,
                    data: profileFollowerCountPartitioned[profileName].reverse(),
                    borderColor: graphColors[index],
                    backgroundColor: graphColors[index],
                })),
            },
        },
    ];
}

function getGraphPartitions(start, end) {
    const date = new Date(end);
    date.setHours(0, 0, 0, 0);

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const partitions = [];

    while (date >= startDate) {
        partitions.push(date.toISOString());
        date.setDate(date.getDate() - 1);
    }

    return partitions;
}

async function getFollowerHistory(ctx, profiles, start, end, timezoneOffset) {
    const { ddbClient } = ctx.resources;

    // Get UTC dates
    const startUTC = getDateWithTimezoneOffset(start, -1 * timezoneOffset);
    const endUTC = getDateWithTimezoneOffset(end, -1 * timezoneOffset);

    return await Promise.all(
        profiles.map(async (profile) => {
            const followerHistory = [];
            try {
                let nextToken = null;
                do {
                    const response = await ddbClient.query({
                        TableName: 'MetricHistory-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                        KeyConditionExpression: '#key = :key AND #createdAt BETWEEN :start AND :end',
                        ExpressionAttributeNames: {
                            '#key': 'key',
                            '#createdAt': 'createdAt',
                        },
                        ExpressionAttributeValues: {
                            ':key': `${profile.key}_followerCount`,
                            ':start': startUTC.toISOString(),
                            ':end': endUTC.toISOString(),
                        },
                        LastEvaluatedKey: nextToken,
                        ScanIndexForward: true,
                    }).promise();

                    followerHistory.push(...response.Items.map(item => ({
                        ...item,
                        createdAt: getDateWithTimezoneOffset(item.createdAt, timezoneOffset),
                    })));
                    nextToken = response.ExclusiveStartKey;
                } while (nextToken !== null && nextToken !== undefined)
            } catch (err) {
                console.error('Failed to get users follower history', err);
            }

            return followerHistory;
        })
    );
}

function getDateWithTimezoneOffset(date, timezoneOffset) {
    return new Date(new Date(date) - (timezoneOffset * 60 * 1000));
}

module.exports = getGraphData;