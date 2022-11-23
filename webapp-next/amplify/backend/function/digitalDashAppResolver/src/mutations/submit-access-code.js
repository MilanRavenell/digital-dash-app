const FAILURE_RESPONSE = { success: false };

async function submitAccessCode(ctx) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { owner, accessCode } = ctx.arguments.input;

    try {
        // Verify access code exists
        const response = await ddbClient.query({
            TableName: `Configuration-${appsync_api_id}-${env}`,
            KeyConditionExpression: '#key = :key AND #value = :value',
            ExpressionAttributeNames: {
                '#key': 'key',
                '#value': 'value',
            },
            ExpressionAttributeValues: {
                ':key': `AccessCode`,
                ':value': accessCode,
            },
            Limit: 1,
        }).promise();

        if (response.Items.length > 0) {
            // Update user record to show user submitted access token
            await ddbClient.update({
                TableName: `User-${appsync_api_id}-${env}`,
                Key: { owner },
                UpdateExpression: 'SET #hasAccess = :hasAccess',
                ExpressionAttributeNames: { 
                    '#hasAccess': 'hasAccess',
                },
                ExpressionAttributeValues: {
                    ':hasAccess': true,
                },
            }).promise();

            // Delete code from table
            // await ddbClient.delete({
            //     TableName: `Configuration-${appsync_api_id}-${env}`,
            //     Key: { key: 'AccessCode', value: accessCode },
            // }).promise();

            return { success: true }
        }

        return FAILURE_RESPONSE;
    } catch (err) {
        console.error(`Failed to submit access code ${accessCode} for user ${owner}`, err);
        return FAILURE_RESPONSE;
    }
    
}

module.exports = submitAccessCode;