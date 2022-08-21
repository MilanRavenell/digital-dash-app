const axios = require("axios");

const FAILURE_RESPONSE = {
    success: false,
    profiles: []
};

async function findInstagramProfiles(ctx) {
    const {  accessToken } = ctx.arguments.input;
    // get pages
    const pages = [];
    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`);
        pages.push(...response.data.data);
    } catch (err) {
        console.error('Failed to get users pages', err);
        return FAILURE_RESPONSE;
    }

    // get profiles
    const profiles = await Promise.all(pages.map(async (page) => {
        try {
            const response = await axios.get(`https://graph.facebook.com/v14.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
            const accountId = response.data.instagram_business_account.id;

            return {
                profileName: page.name,
                meta: JSON.stringify({
                    account_id: accountId,
                    access_token: accessToken,
                }),
            }
        } catch (err) {
            console.error('Failed to get user accounts', err);
            return FAILURE_RESPONSE;
        }
    }));

    return {
        success: true,
        profiles,
    };
}

module.exports = findInstagramProfiles;