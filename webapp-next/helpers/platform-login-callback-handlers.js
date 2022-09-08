import axios from "axios";
import { signOut } from 'next-auth/react';

async function twitterLoginCallbackHandler(sessionData, currentProfiles, setProfiles) {
    // If the profile from the session data already exists, do not display for confirmation
    if (currentProfiles === null || currentProfiles.map(profile => profile.profileName).includes(sessionData.profileName)) {
        return;
    }

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
    };

    signOut({ redirect: false })
    setProfiles([profile]);
}

const platformLoginCallbackHandlers = Object.freeze({
    'twitter': twitterLoginCallbackHandler,
});

module.exports = platformLoginCallbackHandlers;