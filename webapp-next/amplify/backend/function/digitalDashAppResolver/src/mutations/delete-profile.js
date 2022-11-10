const { deleteProfile: deleteProfileHelper } = require('../shared');

async function deleteProfile(ctx) {
    const { owner, profileKey } = ctx.arguments.input;
    return await deleteProfileHelper(ctx, owner, profileKey);    
}

module.exports = deleteProfile;