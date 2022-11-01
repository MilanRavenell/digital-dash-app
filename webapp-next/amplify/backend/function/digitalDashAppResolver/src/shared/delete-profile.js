async function deleteProfile(ctx, username, profileKey) {
    try {
        await Promise.all([deleteUserProfile(ctx, username, profileKey), deletePosts(ctx, profileKey)]);
        return { success: true };
    } catch (err) {
        console.error(`Failed to delete profile ${profileKey} for user ${username}`, err);
        return { success: false };
    }
}

async function deleteUserProfile(ctx, username, profileKey) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    await ddbClient.delete({
        TableName: `UserProfile-${appsync_api_id}-${env}`,
        Key: { user: username, key: profileKey },
    }).promise();
}

async function deletePosts(ctx, profileKey) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    const [platform, profileName] = profileKey.split('_');

    const posts = (await ddbClient.query({
        TableName: `${platformTnFromPlatform[platform]}-${appsync_api_id}-${env}`,
        IndexName: 'ByProfileName',
        KeyConditionExpression: '#profileName = :profileName',
        ProjectionExpression: '#id',
        ExpressionAttributeValues: {
            ':profileName': profileName,
        },
        ExpressionAttributeNames: {
            '#profileName': 'profileName',
            '#id': 'id',
        },

    }).promise())
        .Items;

    await Promise.all(posts.map(async ({ id }) => {
        await ddbClient.delete({
            TableName: `${platformTnFromPlatform[platform]}-${appsync_api_id}-${env}`,
            Key: { id },
        }).promise()
    }));
}
const platformTnFromPlatform = Object.freeze({
    'twitter': 'TwitterPost',
    'instagram-basic': 'InstagramPost',
    'instagram-pro': 'InstagramPost',
    'youtube': 'YoutubePost',
    'tiktok': 'TiktokPost',
});

module.exports = deleteProfile;