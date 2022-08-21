async function twitterLoginCallbackHandler(sessionData, currentProfiles, setProfiles) {
    const profile = {
        profileName: sessionData.profileName,
        meta: JSON.stringify({
            id: sessionData.id,
            oauthToken: sessionData.oauth_token,
            oauthTokenSecret: sessionData.oauth_token_secret,
        })
    };

    if (currentProfiles === null || currentProfiles.map(profile => profile.profileName).includes(profile.profileName)) {
        return;
    }

    setProfiles([profile]);
}

const platformLoginCallbackHandlers = Object.freeze({
    'twitter': twitterLoginCallbackHandler,
});

module.exports = platformLoginCallbackHandlers;