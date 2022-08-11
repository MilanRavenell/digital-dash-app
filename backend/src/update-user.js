const {
    csvHelpers: {
        readFromCsvFile,
        writeToCsvFile,
    },
    constants: {
        usersCsvHeader,
    }
} = require('./helpers');

async function updateUser(username, updateParams) {
    const users = await readFromCsvFile('data/users.csv');

    const userIdx = users.findIndex((user) => (user.username === username));

    users[userIdx] = {
        ...users[userIdx],
        ...updateParams,
    }

    console.log(users)

    await writeToCsvFile('data/users.csv', users, usersCsvHeader);
}

module.exports = updateUser;