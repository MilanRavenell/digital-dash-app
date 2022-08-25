const { getBeefedUserProfiles: getBeefedUserProfilesFunction } = require('../shared');

async function getBeefedUserProfiles(ctx) {
    const { username } = ctx.arguments.input;

    return {
        profiles: await getBeefedUserProfilesFunction(ctx, username),
    };
}

module.exports = getBeefedUserProfiles;