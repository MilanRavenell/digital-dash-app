const axios = require("axios");

const access_token = "EAApFdlyGMG4BAGnaMGpd1LXy9ghzVjdb8M6tnlsR3p9Fl5cRfHvfj3eU7ivsrUkpBfYoGBhFI9rO4GxgdodA5UvyIZAkQnlhLpZAveUvmDuTYHlexKSDZCuRvzcT0u2S5iF8mEooqJMYMKgp6mV5rd3p7EIo6ZAhTtWdaUN1EP5xYbzXBkVM133uwCVSlXUKEAKxWtuMa3X5R1gRr8lG";

async function getDataForAccount(accountId) {
    
}

async function getPages() {
    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/me/accounts?access_token=${access_token}`)
        return response.data.data
    } catch (err) {
        console.error('Failed to get users pages', err);
    }
}

async function getAccountFromPage(pageId) {
    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${pageId}?fields=instagram_business_account&access_token=${access-token}`)
        return response.data.data
    } catch (err) {
        console.error('Failed to get users pages', err);
    }
}

async function getMediaObjectsFromAccount(accountId) {
    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${accountId}/media?access_token=${access-token}`)
        return response.data.data
    } catch (err) {
        console.error('Failed to get users pages', err);
    }
}

async function getAnalyticsForMediaObject(mediaId) {
    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${mediaId}/?access_token=${access-token}`)
        return response.data.data
    } catch (err) {
        console.error('Failed to get users pages', err);
    }
}

bruh()
