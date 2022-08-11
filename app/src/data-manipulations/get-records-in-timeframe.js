"use strict";

function getRecordsInTimeframe(records, partitionDate) {
  if (partitionDate === null) {
    return records;
  }

  return records.filter(record => new Date(record['Date']) > new Date(partitionDate));
}

module.exports = getRecordsInTimeframe;