'use strict';
const complaint = require('./getComplaint');

const getSubmissionApplicantComplaint = (values) => {
  let data = complaint.getComplaint(values);
  data.complaintAttributes.complaint.complaintType = 'SUBMITTING_APPLICATION';
    data.complaintAttributes.complaint.complaintDetails.problemExperienced = complaint.getFormattedEnum(
      values['immigration-application']
    );
  return data;
};

module.exports = {
  getSubmissionApplicantComplaint: getSubmissionApplicantComplaint
};
