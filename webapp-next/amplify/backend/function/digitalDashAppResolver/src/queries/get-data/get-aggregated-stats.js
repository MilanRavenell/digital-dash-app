async function getAggregatedStats(ctx, records, metrics, profiles, end, timezoneOffset) {
    return [
        { name: 'Total Followers', value: await getTotalFollowerCount(ctx, profiles, end, timezoneOffset) },
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
        calculations[`Average ${metric.displayName} per Post`] = (len === 0)
            ? 0
            : (calculations[`Total ${metric.displayName}`] / len)
    });

    calculations['Engagement Rate'] = (calculations['Total Views'] === 0)
        ? null
        : `${(calculations['Total Engagement']/calculations['Total Views'] * 100).toFixed(2) }%`;

    return Object.keys(calculations).map(key => (
        { name: key, value: (calculations[key] === null ? '---' : calculations[key]).toLocaleString() }
    ));
}

async function getTotalFollowerCount(ctx, profiles, end, timezoneOffset) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    try {
        const results = await Promise.all(profiles.map(async (profile) => {
            return (await ddbClient.query({
                TableName: `MetricHistory-${appsync_api_id}-${env}`,
                KeyConditionExpression: '#key = :key AND #createdAt < :end',
                ExpressionAttributeNames: {
                    '#key': 'key',
                    '#createdAt': 'createdAt',
                },
                ExpressionAttributeValues: {
                    ':key': `${profile.key}_followerCount`,
                    ':end': getDateWithTimezoneOffset(end, -1 * timezoneOffset).toISOString(),
                },
                ScanIndexForward: false,
                Limit: 1,
            }).promise())
                .Items
                .map(item => ({
                    ...item,
                    createdAt: getDateWithTimezoneOffset(item.createdAt, timezoneOffset),
                }));
        }));

        return results
            .flat()
            .reduce((sum, { value }) => { return sum + parseInt(value || 0) }, 0)
            .toLocaleString();
    } catch (err) {
        console.log('Failed to get follower count', err);
    }       
}

function getDateWithTimezoneOffset(date, timezoneOffset) {
    return new Date(new Date(date) - (timezoneOffset * 60 * 1000));
}

module.exports = getAggregatedStats;