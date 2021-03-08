'use strict';
const Complaint = require('./complaint');

class SubmittingApplicationComplaint extends Complaint {
  constructor(values) {
    super(values);
    this.complaintAttributes.complaint.complaintType = 'SUBMITTING_APPLICATIO';
    this.complaintAttributes.complaint.complaintDetails.problemExperienced = this.problemExperiencedEnum();
  }

  problemExperiencedEnum() {
    switch (this.values['immigration-application']) {
      case 'technical-issues':
        return 'TECHNICAL_ISSUES';
      case 'guidance':
        return 'GUIDANCE';
      case 'complain':
        return 'SOMETHING_ELSE';
    }
  }
}

module.exports = SubmittingApplicationComplaint;
