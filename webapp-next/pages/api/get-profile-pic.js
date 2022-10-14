import axios from "axios";

export default async function handler(req, res) {
    const { id, accessToken, platform } = req.query;
    console.log(`Fetching profile picture for user ${id} on ${platform}`);

    const profPicUrl = await platformToProfilePictureRetreivalMap[platform](id, accessToken);
    console.log(profPicUrl)

    res.status(200).send(profPicUrl);
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
    'instagram': getInstagramProfilePic,
});