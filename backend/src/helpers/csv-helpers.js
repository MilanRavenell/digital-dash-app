const { promises: fs } = require('fs');
const { parse } = require('csv-parse/sync');
const { createObjectCsvWriter } = require('csv-writer');

async function readFromCsvFile(path) {
    const data = await fs.readFile(path, 'utf8');
    return parse(data, {columns: true, trim: true});
}

async function writeToCsvFile(path, data, header) {
    const csvWriter = createObjectCsvWriter({
        path,
        header,
    });

    await csvWriter.writeRecords(data);
}

module.exports = {
    readFromCsvFile,
    writeToCsvFile,
}