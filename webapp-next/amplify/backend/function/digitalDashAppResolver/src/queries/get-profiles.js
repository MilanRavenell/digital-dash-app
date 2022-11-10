const { getProfiles: getProfilesHelper } = require('../shared');

async function getProfiles(ctx) {
    const { owner } = ctx.arguments.input;
    
    const profiles = await getProfilesHelper(ctx, owner);

    return {
        success: (profiles !== null && profiles !== undefined),
        profiles,
    }
}

module.exports = getProfiles;