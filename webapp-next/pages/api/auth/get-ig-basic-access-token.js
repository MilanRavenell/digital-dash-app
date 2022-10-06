import axios from 'axios';
import AWS from 'aws-sdk';

AWS.config.update({ accessKeyId: 'AKIAR2K6MPFH7YCY42AB', secretAccessKey: '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', region: 'us-west-2' })

export default async function handler(req, res) {
    const { code } = req.query;
    const clientSecret = 'ce11a434af04415b177d2d7cdd4b6084'

    console.log('getting ig basic access token');

    try {
        const params = new URLSearchParams();
        params.append('client_id', '582112473702622');
        params.append('client_secret', clientSecret);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', `${process.env.NEXTAUTH_URL}add-profile/instagram`);
        params.append('code', code);

        const response = await axios.post(
            `https://api.instagram.com/oauth/access_token`,
            params,
        )

        const { access_token, user_id } = response.data;

        const user = (await axios.get(`https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`)).data;
        
        const longLivedTokenResponse = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${access_token}`);

        // Get profile info
        const payloadParams = {
            platform: 'instagram',
            handle: user.username,
            task: 'get_profile_info',
        }

        const lambda = new AWS.Lambda();

        const profileInfoParams = {
            FunctionName: 'web-scraper-service-staging-scrapeContent',
            Payload: JSON.stringify(payloadParams),
        }

        const profileInfoResponse = await lambda.invoke(profileInfoParams).promise();
        console.log(profileInfoResponse)
        const profileInfo = JSON.parse(profileInfoResponse.Payload) || {}

        res.status(200).send({
            ...longLivedTokenResponse.data,
            ...user,
            ...profileInfo,
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