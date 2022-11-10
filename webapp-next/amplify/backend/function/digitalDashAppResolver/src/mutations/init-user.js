const MAX_USERS = 100;

async function initUser(ctx) {
    const { ddbClient, envVars } = ctx.resources;
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

        let usersCount = 0;
        let nextToken = null;
        
        do {
            const response = await ddbClient.scan({
                TableName: `User-${appsync_api_id}-${env}`,
                ExclusiveStartKey: nextToken,
            }).promise();

            usersCount += response.Count;
            nextToken = response.LastEvaluatedKey;
        } while (nextToken)

        user.hasAccess = (usersCount < MAX_USERS);

        await ddbClient.put({
            TableName: `User-${appsync_api_id}-${env}`,
            Item: user,
        }).promise();

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