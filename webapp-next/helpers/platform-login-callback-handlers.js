import axios from "axios";
import { signOut } from 'next-auth/react';

async function twitterLoginCallbackHandler({ sessionData, currentProfiles, setProfiles }) {
    // Get profile pic
    let profilePicUrl = null;
    try {
        profilePicUrl = (await axios.get(`/api/get-profile-pic?id=${sessionData.id}&accessToken=${sessionData.accessToken}&platform=twitter`)).data;
    } catch (err) {
        console.error('Failed to fetch profile picture', err);
    }
    
    const profile = {
        profileName: sessionData.profileName,
        meta: JSON.stringify({
            id: sessionData.id,
            accessToken: sessionData.accessToken,
            refreshToken: sessionData.refreshToken,
            expires: sessionData.expires,
        }),
        profilePicUrl,
        platform: 'twitter',
    };

    signOut({ redirect: false })
    setProfiles([profile]);
}

async function igBasicLoginCallbackHandler({ code, currentProfiles, setProfiles }) {
    try {
        const { access_token, user_id, expires_in, profile_pic_url, username } = (await axios.get(`/api/auth/get-ig-basic-access-token?code=${code}`)).data;

        const profile = {
            profileName: username,
            profilePicUrl: profile_pic_url,
            meta: JSON.stringify({
                id: user_id,
                accessToken: access_token,
                expires: expires_in,
            }),
            platform: 'instagram-basic',
        };

        setProfiles([profile]);

    } catch (err) {
        console.error('Failed to get ig basic access token')
    }
}

const platformLoginCallbackHandlers = Object.freeze({
    'twitter': twitterLoginCallbackHandler,
    'instagram': igBasicLoginCallbackHandler,
});

module.exports = platformLoginCallbackHandlers;