const { getBeefedUserProfiles: getBeefedUserProfilesFunction } = require('./shared');

async function getBeefedUserProfiles(ctx) {
    const { username } = ctx.arguments.input;

    return await getBeefedUserProfilesFunction(ctx, username);
}

module.exports = getBeefedUserProfiles;