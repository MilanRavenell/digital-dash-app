import axios from 'axios';
import { signIn } from 'next-auth/react';

async function igBasicLoginHandler({ router }) {
    // Use this command to locally test ig basic - ngrok http https://localhost:3000
    const appId = '582112473702622';
    const redirectUri = 'https://c54c-38-34-126-58.ngrok.io/add-profile/instagram';

    router.push(`https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`)
}

async function igProLoginHandler({ currentProfiles, setProfiles }) {
    const onSignIn = async (shortTermToken) => {
        const accessToken = (await axios.get(`/api/auth/get-fb-long-lived-token?shortTermToken=${shortTermToken}`)).data;

        const pages = [];
        try {    
            const response = await axios.get(`https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`);
            pages.push(...response.data.data);
        } catch (err) {
            console.error('Failed to get users pages', err);
            return;
        }

        // get profiles
        const profiles = await Promise.all(pages.map(async (page) => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v14.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
                const accountId = response.data.instagram_business_account.id;

                const profileResponse = await axios.get(`https://graph.facebook.com/v14.0/${accountId}?fields=profile_picture_url&access_token=${accessToken}`);
    
                return {
                    profileName: page.name,
                    meta: JSON.stringify({
                        account_id: accountId,
                        access_token: accessToken,
                    }),
                    profilePicUrl: profileResponse.data.profile_picture_url,
                    platform: 'instagram-pro',
                }
            } catch (err) {
                console.error('Failed to get user accounts', err);
                return;
            }
        }));

        setProfiles(profiles);
    };

    FB.login((response) => {
        console.log(response)
        if (response.status === 'connected') {
            onSignIn(response.authResponse.accessToken)
        }
    }, { scope: 'instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement,pages_show_list,business_management'})
}

async function twitterLoginHandler({ router }) {
    signIn('twitter')
}

async function youtubeLoginHandler({ currentProfiles, setProfiles }) {
    const onSignIn = async (response) => {
        const tokenResponse = await axios.get(`/api/auth/get-google-tokens?code=${response.code}`);

        const { access_token: accessToken, refresh_token: refreshToken, expiry_date } = tokenResponse.data;

        const getChannelsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,contentDetails&mine=true&access_token=${accessToken}`);
        console.log(getChannelsResponse)

        if (getChannelsResponse.status === 200) {
            const channels = getChannelsResponse.data.items;
            const profiles = channels.map((channel) => ({
                profileName: channel.snippet.title,
                meta: JSON.stringify({
                    id: channel.id,
                    uploadsId: channel.contentDetails.relatedPlaylists.uploads,
                    accessToken,
                    refreshToken,
                    expires: new Date(expiry_date),
                }),
                profilePicUrl: channel.snippet.thumbnails['default'].url,
                platform: 'youtube',
            }));
    
            if (currentProfiles === null) {
                return;
            }
    
            setProfiles(profiles);
        }
    }

    const client = google.accounts.oauth2.initCodeClient({
        client_id: '581336452597-6c80lf8ijdvhlmi00odvrqsj1iah9lad.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        ux_mode: 'popup',
        callback: onSignIn,
    });

    client.requestCode();
}

async function tiktokLoginHandler({ handle, currentProfiles, setProfiles }) {
    const profileInfo = (await axios.get(`/api/auth/verify-tiktok-bio-contains-token?handle=${handle}`)).data;
    console.log(profileInfo)

    if (profileInfo) {
        const profile = {
            profileName: handle,
            profilePicUrl: profileInfo.profile_pic_url,
            platform: 'tiktok',
        };

        setProfiles([profile]);
    }
}

const platformLoginHandlers = Object.freeze({
    'instagram': [igBasicLoginHandler, igProLoginHandler],
    'youtube': [youtubeLoginHandler],
    'twitter': [twitterLoginHandler],
    'tiktok': [tiktokLoginHandler],
});

module.exports = platformLoginHandlers;