const { deleteProfile } = require('../shared');

async function deleteUser(ctx) {
    const { username } = ctx.arguments.input;

    try {
        await Promise.all([deleteUserRecord(ctx), deleteProfiles(ctx), deleteUserCognito(ctx)]);
        return { success: true };
    } catch (err) {
        console.error(`Failed to delete user ${username}`, err);
        return { success: false };
    }
}

async function deleteUserRecord(ctx) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { username } = ctx.arguments.input;

    await ddbClient.delete({
        TableName: `User-${appsync_api_id}-${env}`,
        Key: { email: username },
    }).promise();
}

async function deleteProfiles(ctx) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;
    const { username } = ctx.arguments.input;

    const profiles = (await ddbClient.query({
        TableName: `UserProfile-${appsync_api_id}-${env}`,
        IndexName: 'ByUserAndPlatform',
        KeyConditionExpression: '#user = :user',
        ExpressionAttributeValues: {
            ':user': username,
        },
        ExpressionAttributeNames: {
            '#user': 'user',
        },
    }).promise())
        .Items;

    await Promise.all(profiles.map(async (profile) => {
        await deleteProfile(profile);
    }));
}

async function deleteUserCognito(ctx) {
    const { cognitoClient, envVars } = ctx.resources;
    const { USER_POOL_ID } = envVars;
    const { owner } = ctx.arguments.input;

    await cognitoClient.adminDeleteUser({
        UserPoolId: USER_POOL_ID,
        Username: owner,
    }).promise();
}

module.exports = deleteUser;