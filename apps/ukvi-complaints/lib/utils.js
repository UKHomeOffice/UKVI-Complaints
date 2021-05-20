'use strict';
const { Producer } = require('sqs-producer');
const config = require('../../../config');
const decsSchema = require('../schema/decs.json');

const validAgainstSchema = (data, validator) => {
  try {
    const valid = validator.validate(data, decsSchema);

    if (valid.errors.length > 0) {
      throw new Error(valid.errors);
    }

    return true;
  } catch (err) {
    throw new Error('Validation against schema failed', err);
  }
};

const sendToQueue = (data, id) => {
  try {
    const producer = Producer.create(config.awsSqs);

    return new Promise((resolve, reject) => {
      producer.send(
        [
          {
            id,
            body: JSON.stringify(data)
          }
        ])
      .then((response) => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
    });
  } catch (err) {
    throw new Error('Failed to send to sqs queue', err);
  }
};

const logToKibana = (message, data) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(message, data);
  }
};

module.exports = {
  validAgainstSchema,
  sendToQueue,
  logToKibana,
};
