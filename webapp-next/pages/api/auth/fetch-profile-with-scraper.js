import axios from 'axios';
import AWS from 'aws-sdk';

export default async function handler(req, res) {
    console.log('Fetching profile with scraper')
    const { handle, platform } = req.query;

    const payloadParams = {
        platform,
        handle,
        task: 'get_profile_info',
    }

    try {
        const lambda = new AWS.Lambda({ region: 'us-west-2', apiVersion: 'latest' });

        const params = {
            FunctionName: `web-scraper-service-${process.env.ENV}-scrapeContent`,
            Payload: JSON.stringify(payloadParams),
        }

        const response = await lambda.invoke(params).promise();
        const data = JSON.parse(response.Payload)

        console.log('done')

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(200).send(err);
    }
}