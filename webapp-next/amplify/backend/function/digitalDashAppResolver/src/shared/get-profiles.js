async function getProfiles(ctx, owner) {
    const { ddbClient, envVars } = ctx.resources;
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = envVars;

    try {
        const profileKeys =  (await ddbClient.query({
            TableName: `UserProfile-${appsync_api_id}-${env}`,
            KeyConditionExpression: '#owner = :owner',
            ExpressionAttributeValues: { ':owner': owner },
            ExpressionAttributeNames: { '#owner': 'owner' }
        }).promise())
            .Items;

        return (await Promise.all(profileKeys.map(async ({ key }) => {
            try {
                return (await ddbClient.get({
                    TableName: `Profile-${appsync_api_id}-${env}`,
                    Key: { key },
                }).promise())
                    .Item;
            } catch (err) {
                console.error(`Failed to fetch profile ${key}`, err);
                return null;
            }
            
        })))
            .filter(profile => (profile !== null && profile !== undefined));
    } catch (err) {
        console.error('Failed to fetch user profiles', err);
        return null;
    }   
}

module.exports = getProfiles;