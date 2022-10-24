import axios from "axios";
import { signOut } from 'next-auth/react';

async function twitterLoginCallbackHandler({ sessionData, currentProfiles, setVerify }) {
    const profile = {
        profileName: sessionData.profileName,
        meta: JSON.stringify({
            id: sessionData.id,
            accessToken: sessionData.accessToken,
            refreshToken: sessionData.refreshToken,
            expires: sessionData.expires,
        }),
        profilePicUrl: sessionData.profilePicUrl,
        platform: 'twitter',
    };

    signOut({ redirect: false })
    setVerify([profile]);
}

async function igBasicLoginCallbackHandler({ code, currentProfiles, setVerify }) {
    try {
        const { access_token, user_id, expires_in, profile_pic_url, username } = (await axios.get(`/api/auth/get-ig-basic-access-token?code=${code}`)).data;

        const profile = {
            profileName: username,
            profilePicUrl: profile_pic_url,
            meta: JSON.stringify({
                account_id: user_id,
                accessToken: access_token,
                expires: expires_in,
            }),
            platform: 'instagram-basic',
        };

        setVerify([profile]);

    } catch (err) {
        console.error('Failed to get ig basic access token')
    }
}

const platformLoginCallbackHandlers = Object.freeze({
    'twitter': twitterLoginCallbackHandler,
    'instagram': igBasicLoginCallbackHandler,
});

module.exports = platformLoginCallbackHandlers;