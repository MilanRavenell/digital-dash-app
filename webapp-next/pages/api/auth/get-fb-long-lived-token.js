import axios from 'axios';

export default async function handler(req, res) {
    const { shortTermToken } = req.query;

    console.log('getting facebook long lived access token');

    try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/oauth/access_token?grant_type=fb_exchange_token&client_id=2891124427862126&client_secret=9c243b62d5aeaeab2dffe6c4a29a2f7e&fb_exchange_token=${shortTermToken}`)
        console.log(response.data)
        res.status(200).send(response.data.access_token);
    } catch (err) {
        console.log(err);
        res.status(200).send(false)
    }
     
}