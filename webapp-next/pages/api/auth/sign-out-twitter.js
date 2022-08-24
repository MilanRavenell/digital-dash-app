import Twitter from 'twitter-lite';
import axios from "axios";

export default function handler(req, res) {
    const { accessToken } = req.query;

    console.log('deleting access token')

    const params = new URLSearchParams();
    params.append('token', accessToken);
    params.append('token_type_hint', 'access_token');

    axios.post(
        `https://api.twitter.com/2/oauth2/revoke`,
        params,
        { 
            auth: {
                username: 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ',
                password: 'uLTmdNbqMi_2GP-7zU7XaL7L00jf69gEmdZ4-08K60Im_IZ1Gn'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        }
    ).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error)
        console.log(error.response.data.errors)
    });

    res.status(200).send('true');
}