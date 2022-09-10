import axios from 'axios';

export default async function handler(req, res) {
    const { code } = req.query;
    const clientSecret = 'ce11a434af04415b177d2d7cdd4b6084'

    console.log('getting ig basic access token');

    try {
        const params = new URLSearchParams();
        params.append('client_id', '582112473702622');
        params.append('client_secret', clientSecret);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', 'https://c54c-38-34-126-58.ngrok.io/add-profile/instagram');
        params.append('code', code);

        const response = await axios.post(
            `https://api.instagram.com/oauth/access_token`,
            params,
        )

        const { access_token, user_id } = response.data;
        
        const longLivedTokenResponse = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${access_token}`);

        res.status(200).send({
            ...longLivedTokenResponse.data,
            user_id,
        });
    } catch (err) {
        if (err.name === 'AxiosError' && err.response && err.response.data) {
            console.error(err.response.data)
        } else {
            console.log(err);
        }
        res.status(200).send(false)
    }
}