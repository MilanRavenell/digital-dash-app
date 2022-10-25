import axios from 'axios';
import AWS from 'aws-sdk';

AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'us-west-2' })

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

        res.status(200).send();
    } catch (err) {
        if (err.name === 'AxiosError' && err.response && err.response.data) {
            console.error(err.response.data)
        } else {
            console.log(err);
        }
        res.status(200).send(false);
    }
}