import AWS from 'aws-sdk';

export default async function handler(req, res) {
    console.log('Launching populate analytics SQS')
    const { username, profileKey } = req.query;

    try {
        const sqsClient = new AWS.SQS({ region: 'us-west-2', apiVersion: 'latest' });

        await sqsClient.sendMessage({
            QueueUrl: `https://sqs.us-west-2.amazonaws.com/125288872271/update-analytics-queue-${process.env.ENV}`,
            MessageBody: JSON.stringify({
                typeName: 'Mutation',
                fieldName: 'populateAnalytics',
                arguments:{
                    input: {
                        username,
                        profileKey,
                    }
                }
            })
        }).promise();

        console.log('done')

        res.status(200).send(true);
    } catch (err) {
        console.error(err);
        res.status(200).send(false);
    }
}