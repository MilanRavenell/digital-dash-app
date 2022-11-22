const {
    getProfiles,
    triggerSqs,
} = require('../shared');

async function updateProfiles(ctx) {
    const { owner, profiles: profilesJSON } = ctx.arguments.input;

    const profiles = JSON.parse(profilesJSON);

    // Get existing profiles
    try {
        await Promise.all(profiles.map(async profile => {
            await Promise.all([
                addUserProfileRecord(ctx, owner, profile.key),
                updateProfileRecord(ctx, profile),
            ]);
        }));

        const finalProfiles = await getProfiles(ctx, owner);

        if (finalProfiles === null || finalProfiles === undefined) {
            throw new Error('Failed to retreive profiles');
        }

        return {
            success: true,
            profiles: finalProfiles,
        };
        
    } catch (err) {
        console.error(`Failed to update profiles for user ${owner}`, err);
        
        return {
            success: false,
            profiles: [],
        }
    }
}

async function addUserProfileRecord(ctx, owner, profileKey) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    const now = new Date().toISOString();
    await ddbClient.put({
        TableName: `UserProfile-${appsync_api_id}-${env}`,
        Item: {
            owner,
            key: profileKey,
            createdAt: now,
            updatedAt: now,
            __typeName: 'UserProfile',
        },
    }).promise();
}

async function updateProfileRecord(ctx, profile) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    const now = new Date().toISOString();
    await ddbClient.put({
        TableName: `Profile-${appsync_api_id}-${env}`,
        Item: {
            ...profile,
            createdAt: now,
            updatedAt: now,
            __typename:"Profile",
        },
    }).promise();

    // Trigger populate analytics sqs
    if (!(await triggerSqs(
        ctx,
        `https://sqs.us-west-2.amazonaws.com/125288872271/update-analytics-queue-${env}`,
        JSON.stringify({
            typeName: 'Mutation',
            fieldName: 'populateAnalytics',
            arguments:{
                input: {
                    profileKey: profile.key,
                }
            }
        }),
    ))) {
        throw new Error('Failed to trigger sqs');
    }
}

module.exports = updateProfiles;