'use strict';
const { v4: uuidv4 } = require('uuid');
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


const sendToQueue = (complaintData) => {
  try {
    const producer = Producer.create(config.awsSqs);

    return new Promise((resolve, reject) => {
      producer.send(
        [
          {
            id: uuidv4(),
            body: JSON.stringify(complaintData)
          }
        ])
      .then((response) => {
        // eslint-disable-next-line no-console
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
  } catch (err) {
    throw new Error('Failed to send to queue', err);
  }
};

module.exports = {
  validAgainstSchema,
  sendToQueue,
};
