import axios from 'axios';
import AWS from 'aws-sdk';

AWS.config.update({ accessKeyId: 'AKIAR2K6MPFH7YCY42AB', secretAccessKey: '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', region: 'us-west-2' })

export default async function handler(req, res) {
    console.log('Verifying tiktok bio has token')
    const { handle } = req.query;

    const payloadParams = {
        platform: 'tiktok',
        handle,
        task: 'verify_bio_contains_token',
    }

    try {
        const lambda = new AWS.Lambda();

        const params = {
            FunctionName: 'web-scraper-service-staging-scrapeContent',
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