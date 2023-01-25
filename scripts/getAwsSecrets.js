// https://aws.amazon.com/developers/getting-started/nodejs/
const appRootPath = require('app-root-path');
const AWS = require('aws-sdk');
const dotenv = require('dotenv-safe');
const fs = require('fs');

dotenv.config({ allowEmptyValues: true });

const env = {
  AWS_REGION: process.env.AWS_REGION,
  AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
};

Object.keys(env).forEach((key) => {
  if (env[key] === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

/**
 * Gets environment variables from the AWS Secret Manager
 *
 * @param {string} secretID ID of the secret
 * @returns {Promise<Object<string, string>>} Environment object
 */
function getAWSSecrets(secretID) {
  return new Promise((resolve, reject) => {
    const client = new AWS.SecretsManager({ region: env.AWS_REGION });
    client.getSecretValue({ SecretId: secretID }, (error, data) => {
      if (error) {
        if (error.code === 'DecryptionFailureException') {
          reject(error);
        } else if (error.code === 'InternalServiceErrorException') {
          reject(error);
        } else if (error.code === 'InvalidParameterException') {
          reject(error);
        } else if (error.code === 'InvalidRequestException') {
          reject(error);
        } else if (error.code === 'ResourceNotFoundException') {
          reject(error);
        } else {
          reject(error);
        }
      } else if (data.SecretString) {
        resolve(JSON.parse(data.SecretString));
      } else if (typeof data.SecretBinary === 'string') {
        const buff = new Buffer(data.SecretBinary, 'base64');
        resolve(JSON.parse(buff.toString('ascii')));
      }
    });
  });
}

getAWSSecrets(env.AWS_SECRET_NAME).then((envObj) => {
  fs.appendFileSync(
    `${appRootPath.path}/.env`,
    `
########## START OF AWS SECRETS ##########
${Object.keys(envObj)
    .map(k => `${k}=${envObj[k]}`)
    .join('\n')}
########### END OF AWS SECRETS ###########
`,
  );
}).catch(error => console.log(error));
