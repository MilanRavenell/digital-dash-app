import { google } from 'googleapis'

export default async function handler(req, res) {
    const { code } = req.query;

    console.log('getting google access token');

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOG_OAUTH_CLIENT_ID,
        process.env.GOOG_OAUTH_CLIENT_SECRET,
        'postmessage', // serves as an empty url since the redirect is not used in this case
    ); 

    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens)

    res.status(200).send(tokens);
}