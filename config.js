'use strict';

/* eslint no-process-env: 0 */

module.exports = {
  dateFormat: 'DD-MM-YYYY',
  dateTimeFormat: 'DD-MM-YYYY, hh:mma',
  redis: {
    password: process.env.REDIS_PASSWORD
  },
  email: process.argv.some(arg => arg === 'mock-sqs') ? {
  from: 'example@example.com',
  replyTo: 'example@example.com',
  transport: 'stub',
  caseworker: 'example@example.com',
  recipient: 'example@example.com',
  transportOptions: {
    accessKeyId: process.env.HOF_SES_USER || process.env.AWS_USER || '',
    secretAccessKey: process.env.HOF_SES_PASSWORD || process.env.AWS_PASSWORD || ''
  },
    emailCaseworker: true,
  } : {
    from: process.env.FROM_ADDRESS || '',
    replyTo: process.env.REPLY_TO || '',
    transport: process.env.EMAIL_TRANSPORT || 'stub',
    caseworker: process.env.CASEWORKER_EMAIL || '',
    recipient: process.env.CASEWORKER_EMAIL || '',
    transportOptions: {
      accessKeyId: process.env.HOF_SES_USER || process.env.AWS_USER || '',
      secretAccessKey: process.env.HOF_SES_PASSWORD || process.env.AWS_PASSWORD || ''
    },
    emailCaseworker: true,
  },
  awsSqs: process.argv.some(arg => arg === 'mock-sqs') ? {
    region: 'eu-west-2',
    queueUrl: 'http://localhost:9324/queue/first-queue',
    accessKeyId: 'example',
    secretAccessKey: 'example',
  } : {
    region: process.env.AWS_REGION || 'eu-west-2',
    queueUrl: process.env.SQS_URL || 'http://localhost:4566/000000000000/local-queue',
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
  },
  sendToQueue: true,
};
