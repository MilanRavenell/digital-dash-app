const AWS = require('aws-sdk');
const ddbClient = new AWS.DynamoDB.DocumentClient();

const {
  getData,
  getBeefedUserProfiles,
} = require('./queries');

const {
  populateAnalytics,
} = require('./mutations');


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const functions = {
  Query: {
    getData,
    getBeefedUserProfiles,
  },
  Mutation: {
    populateAnalytics,
  }
}

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  let objToParse = event;
  if (event.Records) {
    objToParse = JSON.parse(event.Records[0].body);
  }

  const { typeName, fieldName, arguments } = objToParse;

  const response = functions[typeName][fieldName]({
    resources: {
      ddbClient
    },
    arguments,
  });

  return response;
};

