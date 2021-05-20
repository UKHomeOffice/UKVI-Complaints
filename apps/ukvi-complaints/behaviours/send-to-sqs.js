'use strict';
const Validator = require('jsonschema').Validator;
const { v4: uuidv4 } = require('uuid');
const config = require('../../../config');
const {
  validAgainstSchema,
  sendToQueue,
  logToKibana } = require('../lib/utils');
const formatComplaintData = require('../lib/format-complaint-data');

module.exports = superclass => class SendToSQS extends superclass {

  // eslint-disable-next-line consistent-return
  saveValues(req, res, next) {
    let complaintId;
    let complaintData;

    try {
      if (!config.sendToQueue) {
        return next();
      }

      complaintId = uuidv4();
      complaintData = formatComplaintData(req.sessionModel.attributes);

      if (validAgainstSchema(complaintData, new Validator())) {
        return sendToQueue(complaintData, complaintId)
          .then((sqsResponse) => {
            SendToSQS.handleSuccess(next, complaintId, complaintData, sqsResponse);
          })
          .catch(err => {
            SendToSQS.handleError(next, err, complaintId, complaintData);
          });
      }
    } catch (err) {
      SendToSQS.handleError(next, err, complaintId, req.sessionModel.attributes);
    }
  }

  static handleSuccess(next, id, data, sqsResponse) {
    const log = {
        sqsResponse,
        complaintDetails: {
          sqsMessageId: sqsResponse[0].MessageId,
          complaintId: id,
          data
        }
      };

    logToKibana('Successfully sent to SQS queue: ', log);
    return next();
  }


  static handleError(next, err, id, data) {
    err.formNotSubmitted = true;
    err.complaintDetails = {
      complaintId: id,
      data
    };

    logToKibana('Failed to send to SQS queue: ', err);
    return next(err);
  }
};

