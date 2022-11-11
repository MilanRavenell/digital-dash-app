const { removeProfile: removeProfileHelper } = require('../shared');

async function removeProfile(ctx) {
    const { owner, profileKey } = ctx.arguments.input;
    return await removeProfileHelper(ctx, owner, profileKey);
}

module.exports = removeProfile;