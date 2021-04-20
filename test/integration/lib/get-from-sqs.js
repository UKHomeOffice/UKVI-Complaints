'use strict';

const AWS = require('aws-sdk');
const SQS = AWS.SQS;

async function get() {
  const queue = new SQS({
    endpoint: 'http://localhost:9324',
    region: 'eu-west-2', // it does not matter
    accessKeyId: 'example',
    secretAccessKey: 'example'
  });

  return await queue.receiveMessage({QueueUrl: 'http://localhost:9324/queue/first-queue'}).promise();
}

module.exports.get = get;
