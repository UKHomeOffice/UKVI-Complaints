'use strict';
const moment = require('moment');
const enums = require('../enums');

  const getFormattedEnum = (complaintField) => {
    if (enums[complaintField]) {
      return enums[complaintField];
    }

    const invalidField = Object.keys(this.values).find(key => this.values[key] === complaintField);
    throw new Error(`invalid "${invalidField}" value`);
  };

  const createReporterDetails = (values) => {
    switch (values['acting-as-agent']) {
      case 'yes':
        const applicantWithAgentDetails = {
          applicantType: 'AGENT',
          applicantDetails: {
            applicantName: values['agent-representative-name'],
            applicantNationality: values['agent-representative-nationality'],
            applicantDob: values['agent-representative-dob']
          },
          agentDetails: {
            agentName: values['agent-name'],
            agentType: getFormattedEnum(values['who-representing']),
            agentEmail: values['agent-email'],
          }
        };

        if (values['agent-phone']) {
          applicantWithAgentDetails.agentDetails.agentPhone = values['agent-phone'];
        }
        return applicantWithAgentDetails;
      case 'no':
        const applicantDetails = {
          applicantType: 'APPLICANT',
          applicantName: values['applicant-name'],
          applicantNationality: values['applicant-nationality'],
          applicantDob: values['applicant-dob'],
          applicantEmail: values['applicant-email'],
        };
        if (values['applicant-phone']) {
          applicantDetails.applicantPhone = values['applicant-phone'];
        }
        return applicantDetails;
      default:
        throw new Error('invalid "acting-as-agent" value');
    }
  };

  const createReference = (values) => {
    const referenceDetails = {
      reference: values[`${values['reference-numbers']}-reference`]
    };

    switch (values['reference-numbers']) {
      case 'gwf':
        referenceDetails.referenceType = 'GWF_REF';
        return referenceDetails;
      case 'ho':
        referenceDetails.referenceType = 'HO_REF';
        return referenceDetails;
      case 'ihs':
        referenceDetails.referenceType = 'IHS_REF';
        return referenceDetails;
      case 'uan':
        referenceDetails.referenceType = 'UAN_REF';
        return referenceDetails;
      default:
        throw new Error('invalid "reference-numbers" value');
    }
  };

  const getComplaint = (values) => {
    let data = {
        values: values,
        complaintAttributes: {
          creationDate: moment().format('YYYY-MM-DD'),
          complaint: {
            reporterDetails: createReporterDetails(values),
            complaintDetails: {
              complaintText: values['complaint-details']
            }
          }
        },
      };
      if (values['reference-numbers'] && values['reference-numbers'] !== 'none') {
        data.complaintAttributes.complaint.reference = createReference(values);
      }

      if (values['where-applied-from']) {
        data.complaintAttributes.complaint.complaintDetails.applicationLocation = getFormattedEnum(
          values['where-applied-from']
        );
      }
      return data;
  };

module.exports = {
  getComplaint: getComplaint,
  getFormattedEnum: getFormattedEnum,
  createReporterDetails: createReporterDetails
};
