const AWS = require('aws-sdk');
const ddbClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2', apiVersion: 'latest' });
const sqsClient = new AWS.SQS({ region: 'us-west-2', apiVersion: 'latest' });

exports.handler = async (event) => {
    // Get all profiles
    try {
        let nextToken = null;

        do {
            const response = await ddbClient.scan({
                TableName: 'UserProfile-7hdw3dtfmbhhbmqwm7qi7fgbki-staging',
                ExclusiveStartKey: nextToken,
            }).promise();

            await Promise.all(response.Items.map(async (profile) => {
                console.log(`Launching analytics job for user ${profile.user} profile ${profile.profileName}`);

                try {
                    await sqsClient.sendMessage({
                        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/125288872271/update-analytics-queue',
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