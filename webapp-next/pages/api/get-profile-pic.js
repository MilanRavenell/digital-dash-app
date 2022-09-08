import axios from "axios";
const Twitter = require('twitter-lite');

export default async function handler(req, res) {
    const { id, accessToken, platform } = req.query;
    console.log(`Fetching profile picture for user ${id} on ${platform}`);

    const profPicUrl = await platformToProfilePictureRetreivalMap[platform](id, accessToken);
    console.log(profPicUrl)

    res.status(200).send(profPicUrl);
}

async function getTwitterProfilePic(id, accessToken) {
    try {
        const client = new Twitter({
            consumer_key: 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ',
            consumer_secret: 'FaIS5ICp0qvbrRO30zSvngjZLyVU8VEY4V0lsklrsvu0CkK384',
            bearer_token: accessToken,
            version: '2',
            extension: false,
        });

        const response = await client.get(`users/${id}`, {
            'user.fields': 'profile_image_url',
        });

        return response.data.profile_image_url;
    } catch (err) {
        console.error('Failed to get twitter profile picture', err);
    }
}

async function getInstagramProfilePic(id, accessToken) {
    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${id}?fields=profile_picture_url&access_token=${accessToken}`);

        return response.data.profile_picture_url;
    } catch (err) {
        console.error('Failed to get instagram profile information', err);
    }
}

const platformToProfilePictureRetreivalMap = Object.freeze({
    'twitter': getTwitterProfilePic,
    'instagram': getInstagramProfilePic,
});