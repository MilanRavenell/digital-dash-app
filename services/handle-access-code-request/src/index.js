const AWS = require('aws-sdk');
const ddbClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2', apiVersion: 'latest' });
const sesClient = new AWS.SES({ region: 'us-west-2', apiVersion: 'latest' });

const uuid = require('uuid');

const USER_THRESHOLD = 100;

exports.handler = async (event) => {
    if (event.LOCAL_ENVVARS) {
        Object.entries(event.LOCAL_ENVVARS).map(([key, value]) => {
            process.env[key] = value;
        })
    }
    
    const { ENV: env, APPSYNC_API_ID: appsync_api_id } = process.env;

    // check number users is less than threshold
    const users = [];
    try {
        let nextToken = null;

        do {
            const response = await ddbClient.scan({
                TableName: `User-${appsync_api_id}-${env}`,
                ExclusiveStartKey: nextToken,
            }).promise();

            users.push(...response.Items);
            nextToken = response.LastEvaluatedKey;
        } while (nextToken)
    } catch (err) {
        console.error('Failed to get current user count', err);
        return;
    }

    const thresholdReached = users.length > USER_THRESHOLD;

    await Promise.all(event.Records.map(async (record) => {
        const { email, firstName } = JSON.parse(record.body);

        if (thresholdReached) {
            console.log('Sending waitlist email');
            // Send email without access code
            await sendEmail({
                email,
                template: 'Waitlist',
                templateData: JSON.stringify({
                    firstName, 
                }),
            });
            return;
        }
    
        // Generate uuid
        const newAccessCode = uuid.v4();
    
        // add uuid to table of valid access codes
        await ddbClient.put({
            TableName: `Configuration-${appsync_api_id}-${env}`,
            Item: {
                key: 'AccessToken',
                value: newAccessCode,
                createdAt: new Date().toISOString(),
            },
        }).promise();
    
        // email access code to requesting user
        console.log('Sending access token email')
        await sendEmail({
            email,
            template: 'SendAccessToken',
            templateData: JSON.stringify({
                firstName,
                accessCode: newAccessCode, 
            }),
        });
    }));
}

async function sendEmail({ email, template, templateData }) {
    await sesClient.sendTemplatedEmail({
        Destination: {
            ToAddresses: [
                email,
            ]
        },
        Template: template,
        TemplateData: templateData,
        Source: 'orbrealtimeanalytics@gmail.com',
    }).promise();
}