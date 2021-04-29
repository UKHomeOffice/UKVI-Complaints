'use strict';
const sqs = require('../lib/get-from-sqs');

describe('\'BRP\' complaint', () => {

  it('should add the data to the SQS queue', async() => {
    // Select correct complaint category
    await page.goto(baseURL);
    const complaintTypeRadio = await page.$('input#reason-biometric-residence-permit');
    await complaintTypeRadio.check();
    await submitPage();

    // Problem radio
    const problemRadio = await page.$('input#biometric-residence-permit-complain-brp');
    await problemRadio.check();
    await submitPage();

    // No reference number radio
    const referenceNumberRadio = await page.$('input#reference-numbers-none');
    await referenceNumberRadio.check();
    await submitPage();

    // Not filling out on behalf of someone else
    const agentRadio = await page.$('input#acting-as-agent-no');
    await agentRadio.check();
    await submitPage();

    // Name
    await page.fill('#applicant-name', 'Name');
    await submitPage();

    // DOB
    await page.fill('#applicant-dob-day', '1');
    await page.fill('#applicant-dob-month', '1');
    await page.fill('#applicant-dob-year', '2000');
    await submitPage();

    // Nationality
    await page.fill('#applicant-nationality', 'United Kingdom');
    await submitPage();

    // Contact details
    await page.fill('#applicant-email', 'test@test.com');
    await submitPage();

    // Complaint details
    await page.fill('#complaint-details', 'test');
    await submitPage();

    // Check your answers page
    await submitPage();

    // retrieve queue and assert it is length 1
    const queue = await sqs.get();
    expect(queue.Messages.length).to.equal(1);

  });

});
