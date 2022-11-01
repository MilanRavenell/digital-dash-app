async function initUser(ctx) {
    const { ddbClient, sqsClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { email, firstName, lastName, owner } = ctx.arguments.input;

    const now = new Date().toISOString();

    try {
        const user = {
            owner,
            email,
            firstName,
            lastName,
            createdAt: now,
            updatedAt: now,
            __typename: 'User'
        };

        await ddbClient.put({
            TableName: `User-${appsync_api_id}-${env}`,
            Item: user,
        }).promise();

        try {
            await sqsClient.sendMessage({
                QueueUrl: `https://sqs.us-west-2.amazonaws.com/125288872271/handle-access-code-request-queue-${env}`,
                MessageBody: JSON.stringify({
                    email,
                    firstName,
                })
            }).promise();
        } catch (err) {
            console.error(`Failed to send email for new user ${email}`, err);
        }

        return {
            success: true,
            user,
        };
    } catch (err) {
        console.error(`Failed to init user ${email}`, err);
        return {
            success: false,
            user: null,
        };
    }
    
}

module.exports = initUser;