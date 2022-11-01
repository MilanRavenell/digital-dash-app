const { deleteProfile: deleteProfileHelper } = require('../shared');

async function deleteProfile(ctx) {
    const { username, profileKey } = ctx.arguments.input;
    return await deleteProfileHelper(ctx, username, profileKey);    
}

module.exports = deleteProfile;