const AWS =  require('aws-sdk');

async function triggerSqs(ctx) {
    const { queueUrl, body } = ctx.arguments.input;

    try {
        const sqsClient = new AWS.SQS({ region: 'us-west-2', apiVersion: 'latest' });

        await sqsClient.sendMessage({
            QueueUrl: queueUrl,
            MessageBody: body,
        }).promise();

        return { success: true };
    } catch (err) {
        console.error(`Failed to trigger SQS with queue url ${queueUrl} and body ${body}`, err);
        return { success: false };
    }
}

module.exports = triggerSqs;