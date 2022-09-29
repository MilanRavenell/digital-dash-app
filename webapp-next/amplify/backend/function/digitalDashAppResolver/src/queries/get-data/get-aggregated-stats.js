function getAggregatedStats(records, metrics, profiles) {
    return [
        { name: 'Total Followers', value: getTotalFollowerCount(profiles) },
        { name: 'Total Posts', value: records.length.toLocaleString() },
        ...getCalculations(records, metrics),
    ];
}

function getCalculations(records, metrics) {
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
        calculations[`Average ${metric.displayName} per Post`] = (len === 0) ? 0 : (calculations[`Total ${metric.displayName}`] / len)
    });

    calculations['Engagement Rate'] = `${(calculations['Total Engagement']/calculations['Total Views'] * 100).toFixed(2) }%`;

    return Object.keys(calculations).map(key => (
        { name: key, value: calculations[key].toLocaleString() }
    ));
}

function getTotalFollowerCount(profiles) {
    return profiles.reduce((acc, profile) => {
        return acc + parseInt(profile.followerCount || 0);
    }, 0)
        .toLocaleString();
}

module.exports = getAggregatedStats;