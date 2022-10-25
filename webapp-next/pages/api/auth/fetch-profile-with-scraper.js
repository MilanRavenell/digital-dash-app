import axios from 'axios';
import AWS from 'aws-sdk';

AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'us-west-2' })

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
        if (err.name === 'AxiosError' && err.response && err.response.data) {
            console.error(err.response.data)
        } else {
            console.log(err);
        }
        res.status(200).send(false);
    }
}