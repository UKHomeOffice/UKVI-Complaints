/* eslint-disable max-nested-callbacks */
'use strict';
const { expect } = require('chai');
const proxyquire = require('proxyquire');

describe('SendToSQS', () => {
  let res;
  let nextStub;
  let SendToSQS;
  let testSendToSQS;
  let formatComplaintDataStub;
  let sendToQueueStub;
  let validAgainstSchemaStub;
  let logToKibanaStub;
  let uuidStub;
  let testError;

  const req = {
      sessionModel: {
        attributes: 'test attributes'
      }
    };
  const badReq = {
      sessionModel: {
        attributes: 'bad attributes'
      }
    };
  const badDataReq = {
      sessionModel: {
        attributes: 'bad data'
      }
    };

  const testUuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
  const testMessageId = '76cc4b05-de7a-4b39-bc2f-064f81155eaa';
  const sqsProducerResponse = [{ MessageId: testMessageId }];
  const complaintData = {
    data: 'test'
  };
  const badComplaintData = {
    data: 'error'
  };

  class Base {}

  beforeEach(() => {
    testError = new Error('testError');

    nextStub = sinon.stub();

    uuidStub = sinon.stub().returns(testUuid);

    validAgainstSchemaStub = sinon.stub().returns(true);

    logToKibanaStub = sinon.stub();

    formatComplaintDataStub = sinon.stub().returns(complaintData);
    formatComplaintDataStub.withArgs(badReq.sessionModel.attributes).throws(testError);
    formatComplaintDataStub.withArgs(badDataReq.sessionModel.attributes).returns(badComplaintData);

    sendToQueueStub = sinon.stub();
    sendToQueueStub.withArgs(complaintData, testUuid).resolves(sqsProducerResponse);
    sendToQueueStub.withArgs(badComplaintData, testUuid).rejects(testError);

    const Behaviour = proxyquire('../../../../apps/ukvi-complaints/behaviours/send-to-sqs', {
      '../../../config': {
        sendToQueue: true
      },
      '../lib/utils': {
        validAgainstSchema: validAgainstSchemaStub,
        sendToQueue: sendToQueueStub,
        logToKibana: logToKibanaStub,
      },
      'uuid': {
        v4: uuidStub
      },
      '../lib/format-complaint-data': formatComplaintDataStub
    });

    SendToSQS = Behaviour(Base);
    testSendToSQS = new SendToSQS();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('saveValues', () => {
    describe('config.writeToCasework', () => {
      it('If false sendToQueue should not be called', () => {
        const SQSBehaviour = proxyquire('../../../../apps/ukvi-complaints/behaviours/send-to-sqs', {
            '../../../config': {
              sendToQueue: false
            },
            '../lib/utils': {
              validAgainstSchema: validAgainstSchemaStub,
              sendToQueue: sendToQueueStub,
            },
            '../lib/format-complaint-data': formatComplaintDataStub
          }
        );

        const SendToSQSBehaviour = SQSBehaviour(Base);
        const sendToSQSBehaviour = new SendToSQSBehaviour();

        sendToSQSBehaviour.saveValues(req, res, nextStub);

        expect(sendToQueueStub).to.have.callCount(0);

      });

    });

    describe('If valid complaint data', () => {
      it('formatComplaintData should have been called once with sessionModel attributes', () => {
        testSendToSQS.saveValues(req, res, nextStub);
        expect(formatComplaintDataStub).to.have.been.calledOnceWith(req.sessionModel.attributes);
      });

      it('sendToQueue should be called once with complaint data and complaint id', () => {
        testSendToSQS.saveValues(req, res, nextStub);
        expect(sendToQueueStub).to.have.been.calledOnceWith(complaintData, testUuid);
      });

      it('should call logToKibana with success message and complaint details', () => {
        const log = {
          sqsResponse: sqsProducerResponse,
          complaintDetails: {
            sqsMessageId: testMessageId,
            complaintId: testUuid,
            data: complaintData
          }
        };

        return testSendToSQS.saveValues(req, res, nextStub)
          .then(() => {
            expect(logToKibanaStub).to.have.been.calledOnceWith('Successfully sent to SQS queue: ', log);
          });
      });


      it('next should be called once with no arguments', () => {
        return testSendToSQS.saveValues(req, res, nextStub)
        .then(() => {
          expect(nextStub).to.have.been.calledOnceWith();
        });
      });


    });

    describe('If invalid complaint data', () => {
      it('should call logToKibana with failed message and the error', () => {
        testSendToSQS.saveValues(badReq, res, nextStub);
        expect(logToKibanaStub).to.have.been.calledOnceWith('Failed to send to SQS queue: ', testError);
      });

      it('should set complaintDetails on the error from the sessionModel', () => {
        testSendToSQS.saveValues(badReq, res, nextStub);
         expect(testError.complaintDetails).to.eql({
           complaintId: testUuid,
           data: badReq.sessionModel.attributes
         });
      });


      it('should pass the error to the next middleware', () => {
        testSendToSQS.saveValues(badReq, res, nextStub);
        expect(nextStub).to.have.been.calledOnceWith(testError);
      });

      it('should set formNotSubmitted on the error', () => {
        testSendToSQS.saveValues(badReq, res, nextStub);
         expect(testError.formNotSubmitted).to.eql(true);
       });
    });

    describe('If sendToQueue rejects', () => {
      it('should call logToKibana with failed message and the error', () => {
        return testSendToSQS.saveValues(badDataReq, res, nextStub)
          .then(() => {
            expect(logToKibanaStub).to.have.been.calledOnceWith('Failed to send to SQS queue: ', testError);
          });
      });

      it('should set formatted complaint details on the error', () => {
        return testSendToSQS.saveValues(badDataReq, res, nextStub)
          .then(() => {
            expect(testError.complaintDetails).to.eql({
              complaintId: testUuid,
              data: badComplaintData
            });
          });
      });

      it('should pass the error to the next middleware', () => {
       return testSendToSQS.saveValues(badDataReq, res, nextStub)
          .then(() => {
            expect(nextStub).to.have.been.calledOnceWith(testError);
          });

      });

      it('should add formNotSubmitted flag to the error', () => {
        return testSendToSQS.saveValues(badDataReq, res, nextStub)
          .then(() => {
            expect(testError.formNotSubmitted).to.eql(true);
          });
      });
    });
  });
});
