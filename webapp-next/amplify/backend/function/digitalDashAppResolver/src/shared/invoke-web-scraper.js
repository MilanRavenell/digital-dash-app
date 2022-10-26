const AWS = require('aws-sdk');

async function invokeWebScraper(ctx, options) {
    const { WEB_SCRAPER_LAMBDA_NAME: webScraperLambdaName } = ctx.resources.envVars;
    const lambda = new AWS.Lambda({ region: 'us-west-2' });

    try {
        const response = await lambda.invoke({
            FunctionName: webScraperLambdaName,
            Payload: JSON.stringify(options),
        }).promise();

        return JSON.parse(response.Payload);
    } catch (err) {
        console.error(`Failed to invoke web scraper with options ${options}`, err);
        return null;
    }
}

module.exports = invokeWebScraper;