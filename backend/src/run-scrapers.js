const {
    csvHelpers: {
        readFromCsvFile,
    },
} = require('./helpers');

const spawn = require("child_process");

async function runScrapers(username) {
    const users = await readFromCsvFile('data/users.csv');

    const {
        twitter_user,
        twitter_pass,
        twitter_phone,
        youtube_user,
        youtube_pass,
        tiktok_user,
        tiktok_pass,
    } = users.find((user) => (user.username === username));

    // Twitter
    if (twitter_user != '' && twitter_pass != '' && twitter_phone != '') {
        console.log('launching twitter scraper')
        launch_scraper('twitter', twitter_user, twitter_pass, twitter_phone)
    }

    if (youtube_user != '') {
        console.log('launching youtube scraper')
        launch_scraper('youtube', youtube_user)
    }

    if (tiktok_user != '') {
        console.log('launching tiktok scraper')
        launch_scraper('tiktok', tiktok_user)
    }

    //TODO: set user state as loading while scraping data
}

function launch_scraper(platform, ...args) {
    pythonProcess = spawn.spawn('/Users/milanravenell/.pyenv/versions/3.10.5/bin/python', ['scrapers/scrape_content.py', platform, ...args]);
    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        console.log(data.toString())
    });
    pythonProcess.stderr.on('data', (data) => {
        // Do something with the data returned from python script
        console.log(data.toString())
    });
}

module.exports = runScrapers;