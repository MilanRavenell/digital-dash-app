const { invokeWebScraper: invokeWebScraperHelper } = require('../shared');

async function invokeWebScraper(ctx) {
    const { options } = ctx.arguments.input;

    return {
        response: JSON.stringify(await invokeWebScraperHelper(ctx, JSON.parse(options))),
    };
}

module.exports = invokeWebScraper;