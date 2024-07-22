// used: $ npx aws-sdk-js-codemod -t v2-to-v3 PATH...to update From JavaScript V2 to V3
'use strict';
const AWS = require('aws-sdk');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand, S3 } = require('@aws-sdk/client-s3');

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new S3({
  region: process.env.AWS_REGION,
});


const URL_EXPIRATION_SECONDS = 300;

// Main Lambda entry point
exports.handler = async (event) => {
  return await getUploadURL(event);
};

const getUploadURL = async function (event) {
  const randomID = parseInt(Math.random() * 10000000);
  const Key = `${randomID}.jpg`;

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key,
    ContentType: 'image/jpeg',
  };

  console.log('Params: ', s3Params);
  const uploadURL = await getSignedUrl(s3, new PutObjectCommand(s3Params), {
    expiresIn: URL_EXPIRATION_SECONDS,
  });

  return JSON.stringify({
    uploadURL: uploadURL,
    Key,
  });
};
