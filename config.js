'use strict';

/* eslint no-process-env: 0 */
const env = process.env.NODE_ENV || 'production';
const localhost = () => `${process.env.LISTEN_HOST || '0.0.0.0'}:${process.env.PORT || 8080}`;

module.exports = {
  dateFormat: 'DD-MM-YYYY',
  dateTimeFormat: 'DD-MM-YYYY, hh:mma',
  redis: {
    password: process.env.REDIS_PASSWORD
  },
  email: {
    from: process.env.FROM_ADDRESS || 'stub@stub.stub',
    replyTo: process.env.REPLY_TO || 'stub@stub.stub',
    transport: process.env.EMAIL_TRANSPORT || 'stub',
    caseworker: process.env.CASEWORKER_EMAIL || 'stub@stub.stub',
    recipient: process.env.CASEWORKER_EMAIL || 'stub@stub.stub',
    transportOptions: {
      accessKeyId: process.env.HOF_SES_USER || process.env.AWS_USER || '',
      secretAccessKey: process.env.HOF_SES_PASSWORD || process.env.AWS_PASSWORD || ''
    }
  }
};
