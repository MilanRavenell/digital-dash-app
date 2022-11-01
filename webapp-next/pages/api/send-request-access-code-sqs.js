import AWS from 'aws-sdk';

export default async function handler(req, res) {
    AWS.config.update({ accessKeyId: process.env.ACCESS_KEY_ID_AWS, secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS });

    console.log('Launching request access code SQS')
    const { email, firstName } = req.query;

    try {
        const sqsClient = new AWS.SQS({ region: 'us-west-2', apiVersion: 'latest' });

        await sqsClient.sendMessage({
            QueueUrl: `https://sqs.us-west-2.amazonaws.com/125288872271/handle-access-code-request-queue-${process.env.ENV}`,
            MessageBody: JSON.stringify({
                email,
                firstName,
            })
        }).promise();

        res.status(200).send(true);
    } catch (err) {
        console.error(err);
        res.status(200).send(false);
    }
}