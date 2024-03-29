function getGraphData(records, partitions) {
    const viewsPartitoned = partitions.reduce((acc, partition) => ({ ...acc, [partition]: 0 }), {});
    const engagementPartitioned = partitions.reduce((acc, partition) => ({ ...acc, [partition]: 0 }), {});

    let partitionIndex = 0;
    records.every((record) => {
        while (new Date(record.datePosted) < new Date(partitions[partitionIndex])) {
            ++partitionIndex;
            if (partitionIndex >= partitions.length) {
                return false;
            }
        }

        const partition = partitions[partitionIndex];
        viewsPartitoned[partition] += parseInt(record.viewCount);
        engagementPartitioned[partition] += parseInt(record.engagementCount);
        return true;
    });

    return {
        labels: partitions.reverse(),
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

export default getGraphData;