const path = require('path');

const {
    csvHelpers: {
        readFromCsvFile,
        writeToCsvFile,
    },
    constants: {
        usersCsvHeader,
    }
} = require('./helpers');

async function initializeUser(username, password) {
    const userCsvPath = path.resolve('data/users.csv');

    const users = [];
    try {
        users.push(...(await readFromCsvFile(userCsvPath)));
    }
    catch (err) {

    }
    
    if (users.filter((user) => (user.username === username)).length > 0) {
        return;
    }

    users.push({
        username,
        password
    });

    await writeToCsvFile(userCsvPath, users, usersCsvHeader);
}

module.exports = initializeUser;