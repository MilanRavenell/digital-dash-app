import axios from "axios";

export default async function handler(req, res) {
    const { url } = req.query;
    console.log('setting cors on request')

    const response = await axios.get(url.replace(/@@@@/g, '&'), { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'utf-8');
    res.status(200).send(buffer);

    return;
}