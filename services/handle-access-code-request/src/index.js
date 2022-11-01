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

    // check that an access code is available
    const accessCodes = [];
    try {
        let nextToken = null;

        do {
            const response = await ddbClient.query({
                TableName: `Configuration-${appsync_api_id}-${env}`,
                KeyConditionExpression: '#key = :key',
                ExpressionAttributeNames: {
                    '#key': 'key',
                },
                ExpressionAttributeValues: {
                    ':key': `AccessCode`,
                },
                ExclusiveStartKey: nextToken,
            }).promise();

            console.log(response)

            accessCodes.push(
                ...response
                    .Items
                    .map(({ value }) => value)
            );
            nextToken = response.LastEvaluatedKey;
        } while (nextToken)
    } catch (err) {
        console.error('Failed to get current user count', err);
        return;
    }

    // select access tokens
    const selectedAccessCodes = event.Records.map(() => {
        if (accessCodes.length === 0 ) {
            return null;
        }

        const randIndex = Math.floor(Math.random() * accessCodes.length);
        return accessCodes.splice(randIndex, 1)[0];
    });

    await Promise.all(event.Records.map(async (record, index) => {
        const { email, firstName } = JSON.parse(record.body);

        if (!selectedAccessCodes[index]) {
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
    
        // email access code to requesting user
        console.log('Sending access token email')
        await sendEmail({
            email,
            template: 'SendAccessToken',
            templateData: JSON.stringify({
                firstName,
                accessCode: selectedAccessCodes[index],
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