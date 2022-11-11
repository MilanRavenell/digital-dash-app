const AWS =  require('aws-sdk');

async function triggerSqs(ctx, queueUrl, body) {
    const { sqsClient } = ctx.resources;
    try {
        await sqsClient.sendMessage({
            QueueUrl: queueUrl,
            MessageBody: body,
        }).promise();

        return true;
    } catch (err) {
        console.error(`Failed to trigger SQS with queue url ${queueUrl} and body ${body}`, err);
        return false;
    }
}

module.exports = triggerSqs;