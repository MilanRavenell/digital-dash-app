import axios from 'axios';
import { signIn } from 'next-auth/react';

async function igBasicLoginHandler({ handle, setVerify, setFail }) {
    const profileInfo = (await axios.get(`/api/auth/fetch-profile-with-scraper?handle=${handle}&platform=instagram`)).data;
    console.log(profileInfo)

    if (profileInfo) {
        const profile = {
            profileName: handle,
            profilePicUrl: `/api/fetch-image?url=${profileInfo.profile_pic_url.replace(/&/g, '@@@@')}`,
            platform: 'instagram-basic',
        };

        setVerify([profile]);
    } else {
        setFail();
    }
}

async function igProLoginHandler({ currentProfiles, setVerify, setFail }) {
    const onSignIn = async (shortTermToken) => {
        const accessToken = (await axios.get(`/api/auth/get-fb-long-lived-token?shortTermToken=${shortTermToken}`)).data;

        const pages = [];
        try {    
            const response = await axios.get(`https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`);
            pages.push(...response.data.data);
        } catch (err) {
            console.error('Failed to get users pages', err);
            setFail();
            return;
        }

        // get profiles
        const profiles = await Promise.all(pages.map(async (page) => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v14.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
                const accountId = response.data.instagram_business_account.id;

                const profileResponse = await axios.get(`https://graph.facebook.com/v14.0/${accountId}?fields=profile_picture_url,username&access_token=${accessToken}`);
    
                return {
                    profileName: profileResponse.data.username,
                    meta: JSON.stringify({
                        account_id: accountId,
                        access_token: accessToken,
                    }),
                    profilePicUrl: profileResponse.data.profile_picture_url,
                    platform: 'instagram-pro',
                }
            } catch (err) {
                console.error('Failed to get user accounts', err);
                setFail();
                return;
            }
        }));

        setVerify(profiles);
    };

    FB.login((response) => {
        console.log(response)
        if (response.status === 'connected') {
            onSignIn(response.authResponse.accessToken)
        }
    }, { scope: 'instagram_basic,pages_show_list' })
}

async function twitterLoginHandler({ router }) {
    signIn('twitter')
}

async function youtubeLoginHandler({ currentProfiles, setVerify, setFail }) {
    const onSignIn = async (response) => {
        try {
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
        
                setVerify(profiles);
            }
        } catch (err) {
            console.error('Failed to get youtube profile', err);
            setFail();        
        }        
    }

    const client = google.accounts.oauth2.initCodeClient({
        client_id:  process.env.GOOG_OAUTH_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        ux_mode: 'popup',
        callback: onSignIn,
    });

    client.requestCode();
}

async function tiktokLoginHandler({ handle, setVerify }) {
    const profileInfo = (await axios.get(`/api/auth/fetch-profile-with-scraper?handle=${handle}&platform=tiktok`)).data;
    console.log(profileInfo)

    if (profileInfo) {
        const profile = {
            profileName: handle,
            profilePicUrl: profileInfo.profile_pic_url,
            platform: 'tiktok',
        };

        setVerify([profile]);
    } else {
        setFail();
    }
}

const platformLoginHandlers = Object.freeze({
    'instagram': [igBasicLoginHandler, igProLoginHandler],
    'youtube': [youtubeLoginHandler],
    'twitter': [twitterLoginHandler],
    'tiktok': [tiktokLoginHandler],
});

module.exports = platformLoginHandlers;