function getAggregatedStats(records, metrics) {
    return {
        'Total Posts': records.length,
        ...getTotalAndAverageFromRecords(records, metrics)
    };
}

function getTotalAndAverageFromRecords(records, metrics) {
    const calculations = metrics.reduce((acc, metric) => {
        acc[`Total ${metric}`] = 0
        return acc
    }, {});

    const len = records.length;

    for (const record of records) {
        metrics.forEach((metric) => {
            calculations[`Total ${metric}`] += parseFloat((record[metric]));
        });
    }

    metrics.forEach((metric) => {
        calculations[`Average ${metric}`] = (len === 0) ? 0 : calculations[`Total ${metric}`] / len
    });

    return calculations;
}
export default getAggregatedStats;