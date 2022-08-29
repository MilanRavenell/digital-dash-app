import axios from "axios";

export default async function handler(req, res) {
    const { id, accessToken } = req.query;

    const response = await axios.delete(`https://graph.facebook.com/v14.0/me/permissions?access_token=${accessToken}`);
    console.log(response)

    res.status(200).send('true');
}