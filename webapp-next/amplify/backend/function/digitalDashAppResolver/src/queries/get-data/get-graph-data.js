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

function getGraphData(records, profiles, start, end) {
    const partitions = getGraphPartitions(start, end);

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

    let partitionIndex = 0;
    records.forEach((record) => {
        while (new Date(record.datePosted) < new Date(partitions[partitionIndex]) && (partitionIndex < partitions.length - 1)) {
            profiles.forEach(({ profileName }) => {
                if (profileViewsPartitioned[profileName][partitionIndex] > 0) {
                    profileEngagementRatePartitioned[profileName][partitionIndex] = 
                        parseFloat(profileEngagementPartitioned[profileName][partitionIndex])
                        / profileViewsPartitioned[profileName][partitionIndex];
                }
            })
            ++partitionIndex;
        }

        totalViewsPartitoned[partitionIndex] += parseInt(record.viewCount || 0);
        totalEngagementPartitioned[partitionIndex] += parseInt(record.engagementCount || 0);

        profileViewsPartitioned[record.profileName][partitionIndex] += parseInt(record.viewCount || 0);
        profileEngagementPartitioned[record.profileName][partitionIndex] += parseInt(record.engagementCount || 0);
    });

    // Calculate engagement rate for last partition
    profiles.forEach(({ profileName }) => {
        if (profileViewsPartitioned[profileName][partitionIndex] > 0) {
            profileEngagementRatePartitioned[profileName][partitionIndex] = 
                parseFloat(profileEngagementPartitioned[profileName][partitionIndex])
                / profileViewsPartitioned[profileName][partitionIndex];
        }
    })

    partitions.reverse();

    const rainbow = new Rainbow();

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
                    },
                    {
                        label: 'Engagement',
                        data: totalEngagementPartitioned.reverse(),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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

module.exports = getGraphData;