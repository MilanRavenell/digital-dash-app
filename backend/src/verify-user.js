const path = require('path');

const {
    csvHelpers: {
        readFromCsvFile,
    },
} = require('./helpers');

async function verifyUser(username, password) {
    const userCsvPath = path.resolve('data/users.csv');

    try {
        const users = await readFromCsvFile(userCsvPath);
        return (users.filter((user) => (user.username === username && user.password === password)).length > 0);
    }
    catch (err) {
        return false;
    }
}

module.exports = verifyUser;