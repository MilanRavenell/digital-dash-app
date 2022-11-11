async function removeProfile(ctx, owner, profileKey) {
    const jobs = [deleteUserProfile(ctx, owner, profileKey)];

    // Keep profile and posts if it's a tiktok or instagram basic account
    if (!['tiktok', 'instagram-basic'].includes(profileKey.split('_')[0])) {
        jobs.push(deleteProfile(ctx, profileKey), deletePosts(ctx, profileKey));
    }

    try {
        await Promise.all(jobs);
        return { success: true };
    } catch (err) {
        console.error(`Failed to delete profile ${profileKey} for user ${owner}`, err);
        return { success: false };
    }
}

async function deleteUserProfile(ctx, owner, profileKey) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    await ddbClient.delete({
        TableName: `UserProfile-${appsync_api_id}-${env}`,
        Key: { owner, key: profileKey },
    }).promise();
}

async function deleteProfile(ctx, profileKey) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    await ddbClient.delete({
        TableName: `Profile-${appsync_api_id}-${env}`,
        Key: { key: profileKey },
    }).promise();
}

async function deletePosts(ctx, profileKey) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    if (['tiktok', 'instagram-basic'].includes(profileKey.split('_')[0])) {
        return;
    }

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

module.exports = removeProfile;