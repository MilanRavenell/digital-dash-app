import axios from 'axios';
import { signIn } from 'next-auth/react';

async function igLoginHandler(currentProfiles, setProfiles) {
    const onSignIn = async (accessToken) => {
        const pages = [];
        try {
            const response = await axios.get(`https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`);
            pages.push(...response.data.data);
        } catch (err) {
            console.error('Failed to get users pages', err);
            return FAILURE_RESPONSE;
        }
    
        // get profiles
        const profiles = await Promise.all(pages.map(async (page) => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v14.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
                const accountId = response.data.instagram_business_account.id;
    
                return {
                    profileName: page.name,
                    meta: JSON.stringify({
                        account_id: accountId,
                        access_token: accessToken,
                    }),
                }
            } catch (err) {
                console.error('Failed to get user accounts', err);
                return FAILURE_RESPONSE;
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

async function twitterLoginHandler() {
    signIn();
}

async function youtubeLoginHandler(currentProfiles, setProfiles) {
    const onSignIn = async (response) => {
        const accessToken = response.access_token;
        const getChannelsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,contentDetails&mine=true&access_token=${accessToken}`);

        if (getChannelsResponse.status === 200) {
            const channels = getChannelsResponse.data.items;
            const profiles = channels.map((channel) => ({
                profileName: channel.snippet.title,
                meta: JSON.stringify({
                    id: channel.contentDetails.relatedPlaylists.uploads,
                    accessToken,
                })
            }));
    
            if (currentProfiles === null) {
                return;
            }
    
            const curProfileNames = currentProfiles.map(profile => profile.profileName);
            const filteredProfiles = profiles.filter(({ profileName }) => !curProfileNames.includes(profileName));
    
            if (filteredProfiles.length > 0) {
                setProfiles(filteredProfiles);
            }
        }
    }

    const client = google.accounts.oauth2.initTokenClient({
        client_id: '581336452597-6c80lf8ijdvhlmi00odvrqsj1iah9lad.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        callback: onSignIn,
    });

    client.requestAccessToken()
}

const platformLoginHandlers = Object.freeze({
    'instagram': igLoginHandler,
    'youtube': youtubeLoginHandler,
    'twitter': twitterLoginHandler,
});

module.exports = platformLoginHandlers;