const AWS = require('aws-sdk');
const ddbClient = new AWS.DynamoDB.DocumentClient();

const queries = require('./queries');
const mutations = require('./mutations');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const functions = {
  Query: queries,
  Mutation: mutations,
}

function populateLocalEnvVars(localEnvvars) {
  Object.entries(localEnvvars).map(([key, value]) => {
    process.env[key] = value;
  })
}

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // If executed from local, manually populate env vars from event file
  if (event.LOCAL_ENVVARS) {
    populateLocalEnvVars(event.LOCAL_ENVVARS);
  }

  let objToParse = event;
  if (event.Records) {
    objToParse = JSON.parse(event.Records[0].body);
  }

  const { typeName, fieldName, arguments } = objToParse;

  const response = functions[typeName][fieldName]({
    resources: {
      ddbClient,
      envVars: process.env,
    },
    arguments,
  });

  return response;
};

