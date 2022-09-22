const moment = require('moment');

function getGraphData(records, start, end) {
    const partitions = getGraphPartitions(start, end);
    const viewsPartitoned = partitions.reduce((acc, partition) => ({ ...acc, [partition]: 0 }), {});
    const engagementPartitioned = partitions.reduce((acc, partition) => ({ ...acc, [partition]: 0 }), {});

    let partitionIndex = 0;
    records.forEach((record) => {
        while (new Date(record.datePosted) < new Date(partitions[partitionIndex]) && (partitionIndex < partitions.length - 1)) {
            ++partitionIndex;
        }

        const partition = partitions[partitionIndex];
        viewsPartitoned[partition] += parseInt(record.viewCount || 0);
        engagementPartitioned[partition] += parseInt(record.engagementCount || 0);
    });

    return {
        labels: partitions
            .reverse()
            .map(partition => moment(partition).format('MMM D, YYYY')),
        datasets: [
            {
                label: 'Views',
                data: Object.values(viewsPartitoned).reverse(),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Engagement',
                data: Object.values(engagementPartitioned).reverse(),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ]
    };
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