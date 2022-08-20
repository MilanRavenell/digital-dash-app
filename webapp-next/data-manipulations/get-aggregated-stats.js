function getAggregatedStats(records, metrics) {
    return {
        'Total Posts': records.length,
        ...getTotalAndAverageFromRecords(records, metrics)
    };
}

function getTotalAndAverageFromRecords(records, metrics) {
    const calculations = metrics.reduce((acc, metric) => {
        acc[`Total ${metric.displayName}`] = 0
        return acc
    }, {});

    const len = records.length;

    for (const record of records) {
        metrics.forEach((metric) => {
            calculations[`Total ${metric.displayName}`] += parseFloat((record[metric.field] || 0));
        });
    }

    metrics.forEach((metric) => {
        calculations[`Average ${metric.displayName}`] = (len === 0) ? 0 : calculations[`Total ${metric.displayName}`] / len
    });

    return calculations;
}

export default getAggregatedStats;