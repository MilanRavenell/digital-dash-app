const Twitter = require('twitter-lite');
import { signOut } from 'next-auth/react';

async function twitterLoginCallbackHandler(sessionData, currentProfiles, setProfiles) {
    const profile = {
        profileName: sessionData.profileName,
        meta: JSON.stringify({
            id: sessionData.id,
            accessToken: sessionData.accessToken,
            refreshToken: sessionData.refreshToken,
            expires: sessionData.expires,
        }),
    };

    if (currentProfiles === null || currentProfiles.map(profile => profile.profileName).includes(profile.profileName)) {
        return;
    }

    signOut({ redirect: false })
    setProfiles([profile]);
}

const platformLoginCallbackHandlers = Object.freeze({
    'twitter': twitterLoginCallbackHandler,
});

module.exports = platformLoginCallbackHandlers;