'use strict';

const Emailer = require('hof-behaviour-emailer');
const path = require('path');
const moment = require('moment');

// eslint-disable-next-line complexity
const getDataRows = (model, translate) => {
  return [
    {
      title: 'Complaint details',
      table: [
        model.reason && {
          label: translate('pages.confirm.fields.reason.label'),
          value: translate(`fields.reason.options[${model.reason}].label`)
        },
        model['immigration-application'] && {
          label: translate('pages.confirm.fields.immigration-application.label'),
          value: translate(`fields.immigration-application.options[${model['immigration-application']}].label`)
        },
        model['immigration-appointment'] && {
          label: translate('pages.confirm.fields.immigration-appointment.label'),
          value: translate(`fields.immigration-appointment.options[${model['immigration-appointment']}].label`)
        },
        model['delay-type'] && {
          label: translate('pages.confirm.fields.delay-type.label'),
          value: translate(`fields.delay-type.options[${model['delay-type']}].label`)
        },
        model['return-of-documents'] && {
          label: translate('pages.confirm.fields.return-of-documents.label'),
          value: translate(`fields.return-of-documents.options[${model['return-of-documents']}].label`)
        },
        model['decision-outcome'] && {
          label: translate('pages.confirm.fields.decision-outcome.label'),
          value: translate(`fields.decision-outcome.options[${model['decision-outcome']}].label`)
        },
        model['biometric-residence-permit'] && {
          label: translate('pages.confirm.fields.biometric-residence-permit.label'),
          value: translate(`fields.biometric-residence-permit.options[${model['biometric-residence-permit']}].label`)
        },
        model['poor-info-or-behaviour'] && {
          label: translate('pages.confirm.fields.poor-info-or-behaviour.label'),
          value: translate(`fields.poor-info-or-behaviour.options[${model['poor-info-or-behaviour']}].label`)
        },
        model['staff-behaviour'] && {
          label: translate('pages.confirm.fields.staff-behaviour.label'),
          value: translate(`fields.staff-behaviour.options[${model['staff-behaviour']}].label`)
        },
        model['which-centre'] && {
          label: translate('pages.confirm.fields.which-centre.label'),
          value: translate(`fields.which-centre.options[${model['which-centre']}].label`)
        },
        model.refund && {
          label: translate('pages.confirm.fields.refund.label'),
          value: translate(`fields.refund.options[${model.refund}].label`)
        },
        model['refund-when'] && {
          label: translate('pages.confirm.fields.refund-when.label'),
          value: translate(`fields.refund-when.options[${model['refund-when']}].label`)
        },
        model['refund-type'] && {
          label: translate('pages.confirm.fields.refund-type.label'),
          value: translate(`fields.refund-type.options[${model['refund-type']}].label`)
        },
        model['where-applied-from'] && {
          label: translate('pages.confirm.fields.where-applied-from.label'),
          value: translate(`fields.where-applied-from.options[${model['where-applied-from']}].label`)
        },
        model['existing-complaint'] && {
          label: translate('pages.confirm.fields.existing-complaint.label'),
          value: translate(`fields.existing-complaint.options[${model['existing-complaint']}].label`)
        },
        model['complaint-reason-previous'] && {
          label: translate('pages.confirm.fields.complaint-reason-previous.label'),
          value: translate(`fields.complaint-reason-previous.options[${model['complaint-reason-previous']}].label`)
        },
        model['called-number'] && {
          label: translate('pages.confirm.fields.called-number.label'),
          value: model['called-number']
        },
        model['called-date'] && {
          label: translate('pages.confirm.fields.called-date.label'),
          value: model['called-date']
        },
        model['called-time'] && {
          label: translate('pages.confirm.fields.called-time.label'),
          value: model['called-time']
        },
        model['called-from'] && {
          label: translate('pages.confirm.fields.called-from.label'),
          value: model['called-from']
        },
        model['ssc-city'] && {
          label: translate('pages.confirm.fields.ssc-city.label'),
          value: model['ssc-city']
        },
        model['vac-country'] && {
          label: translate('pages.confirm.fields.vac-country.label'),
          value: model['vac-country']
        },
        model['vac-city'] && {
          label: translate('pages.confirm.fields.vac-city.label'),
          value: model['vac-city']
        },
        model['ukvcas-city'] && {
          label: translate('pages.confirm.fields.ukvcas-city.label'),
          value: model['ukvcas-city']
        },
        model['when-applied'] && {
          label: translate('pages.confirm.fields.when-applied.label'),
          value: model['when-applied']
        },
        model['complaint-reference-number'] && {
          label: translate('pages.confirm.fields.complaint-reference-number.label'),
          value: model['complaint-reference-number']
        },
        model['gwf-reference'] && {
          label: translate('pages.confirm.fields.gwf-reference.label'),
          value: model['gwf-reference']
        },
        model['ho-reference'] && {
          label: translate('pages.confirm.fields.ho-reference.label'),
          value: model['ho-reference']
        },
        model['ihs-reference'] && {
          label: translate('pages.confirm.fields.ihs-reference.label'),
          value: model['ihs-reference']
        },
        model['uan-reference'] && {
          label: translate('pages.confirm.fields.uan-reference.label'),
          value: model['uan-reference']
        },
        model['complaint-details'] && {
          label: translate('pages.confirm.fields.complaint-details.label'),
          value: model['complaint-details']
        }
      ]
    },
    model['agent-name'] && {
      title: 'Your details',
      table: [
        {
          label: 'Full name',
          value: model['agent-name']
        },
        {
          label: 'What is your relation to the applicant?',
          value: translate(`fields['who-representing'].options[${model['who-representing']}].label`)
        }
      ]
    },
    model['agent-representative-name'] && {
      title: 'Applicant details',
      table: [
        {
          label: 'Applicants full name',
          value: model['agent-representative-name']
        },
        {
          label: 'Applicant’s country of nationality',
          value: model['agent-representative-nationality']
        },
        {
          label: 'Applicant’s date of birth',
          value: moment(model['agent-representative-dob']).format('D MMMM YYYY')
        }
      ]
    },
    model['applicant-name'] && {
      title: 'Your details',
      table: [
        {
          label: 'Full name',
          value: model['applicant-name']
        },
        {
          label: 'Country of nationality',
          value: model['applicant-nationality']
        },
        {
          label: 'Date of birth',
          value: moment(model['applicant-dob']).format('D MMMM YYYY')
        }
      ]
    },
    model['applicant-email'] && {
      title: 'Contact details',
      table: [
        {
          label: 'Email address',
          value: model['applicant-email']
        },
        model['applicant-phone'] && {
          label: 'Phone number (optional)',
          value: model['applicant-phone']
        }
      ]
    },
    model['agent-email'] && {
      title: 'Contact details',
      table: [
        {
          label: 'Agent Email address',
          value: model['agent-email']
        },
        model['agent-phone'] && {
          label: 'Agent Phone number',
          value: model['agent-phone']
        },
      ]
    }
  ].filter(Boolean);
};

module.exports = config => {
  if (config.transport !== 'stub' && !config.from && !config.replyTo) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: Email `from` address must be provided. Falling back to stub email transport.');
  }
  return Emailer(Object.assign({}, config, {
    transport: config.from ? config.transport : 'stub',
    recipient: model => model['applicant-email'] || model['agent-email'] || 'noop@localhost',
    subject: (model, translate) => translate('pages.email.customer.subject'),
    template: path.resolve(__dirname, '../emails/customer.html'),
    parse: (model, translate) => {
        return Object.assign(model, {
          data: getDataRows(model, translate)
        });
    }
  }));
};
