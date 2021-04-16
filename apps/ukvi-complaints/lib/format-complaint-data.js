'use strict';

const SubmittingApplicationComplaint = require('./json-converters/submitting-application');
const MakingAppointmentComplaint = require('./json-converters/making-appointment');
const DelaysComplaint = require('./json-converters/delays');
const BrpComplaint = require('./json-converters/brp');
const DecisionComplaint = require('./json-converters/decision');
const RefundComplaint = require('./json-converters/refund');
const InformationIssueComplaint = require('./json-converters/information-issue');
const StaffBehaviourComplaint = require('./json-converters/staff-behaviour');
const ExistingComplaint = require('./json-converters/existing');
const SomethingElseComplaint = require('./json-converters/something-else');
const complaint = require('./json-converters/getComplaint');
const submissionComplaint = require('./json-converters/getSubmissionApplicantComplaint');
const { complain } = require('./enums');

// eslint-disable-next-line complexity
const formatComplaintData = (values) => {
  switch (values.reason) {
    case 'immigration-application':
      // complaint.hello();
      // console.log(JSON.stringify(complaint.getComplaint(values), null, 4));
      const submittingApplication = new SubmittingApplicationComplaint(values);
      const blah = submissionComplaint.getSubmissionApplicantComplaint(values);
      console.log('class =>', JSON.stringify(submittingApplication.complaintAttributes, null, 4));
      console.log('function =>', JSON.stringify(blah.complaintAttributes, null, 4));
      return submittingApplication.complaintAttributes;

    case 'immigration-appointment':
      const makingApplication = new MakingAppointmentComplaint(values);
      return makingApplication.complaintAttributes;

    case 'delays':
      const delays = new DelaysComplaint(values);
      return delays.complaintAttributes;

    case 'biometric-residence-permit':
      const brp = new BrpComplaint(values);
      return brp.complaintAttributes;

    case 'immigration-decision':
      const decision = new DecisionComplaint(values);
      return decision.complaintAttributes;

    case 'refund':
      const refund = new RefundComplaint(values);
      return refund.complaintAttributes;

    case 'staff-behaviour':
      if (values['poor-info-or-behaviour'] === 'poor-information') {
        const informationIssue = new InformationIssueComplaint(values);
        return informationIssue.complaintAttributes;
      }

      if (values['poor-info-or-behaviour'] === 'staff-behaviour') {
        const staffBehaviour = new StaffBehaviourComplaint(values);
      return staffBehaviour.complaintAttributes;
      }

      throw new Error('Invalid poor-info-or-behaviour value');

    case 'existing-complaint':
      const existing = new ExistingComplaint(values);
      return existing.complaintAttributes;

    case 'other-complaint':
      const somethingElse = new SomethingElseComplaint(values);
      return somethingElse.complaintAttributes;

    default:
      throw new Error('Complaint reason not recognized');
  }
};

module.exports = formatComplaintData;
