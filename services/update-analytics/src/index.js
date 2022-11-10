const AWS = require('aws-sdk');
const ddbClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2', apiVersion: 'latest' });
const sqsClient = new AWS.SQS({ region: 'us-west-2', apiVersion: 'latest' });

exports.handler = async (event) => {
    if (event.LOCAL_ENVVARS) {
        Object.entries(event.LOCAL_ENVVARS).map(([key, value]) => {
            process.env[key] = value;
        })
    }

    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = process.env;

    // Get all profiles
    try {
        let nextToken = null;
        const now = new Date();

        do {
            const response = await ddbClient.scan({
                TableName: `UserProfile-${appsync_api_id}-${env}`,
                ExclusiveStartKey: nextToken,
            }).promise();

            await Promise.all(response.Items.map(async (profile) => {
                console.log(`Launching analytics job for user ${profile.user} profile ${profile.profileName}`);

                if (['tiktok', 'instagram-basic'].includes(profile.platform) && now.getUTCHours() % 6 !== 0) {
                    return;
                }

                try {
                    await sqsClient.sendMessage({
                        QueueUrl: `https://sqs.us-west-2.amazonaws.com/125288872271/update-analytics-queue-${process.env.ENV}`,
                        MessageBody: JSON.stringify({
                            typeName: 'Mutation',
                            fieldName: 'populateAnalytics',
                            arguments:{
                                input: {
                                    username: profile.user,
                                    profileKey: profile.key,
                                }
                            }
                        })
                    }).promise();
                } catch (err) {
                    console.error(`Failed to launch job`, err);
                }
            }));

            nextToken = response.LastEvaluatedKey;
        } while (nextToken)
        
    } catch (err) {
        console.error('Failed to get profiles', err);
    }
};