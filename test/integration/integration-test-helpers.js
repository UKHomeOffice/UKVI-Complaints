'use strict';

const playwright = require('playwright');
global.baseURL = 'http://localhost:8080';

before(async() => {
  try {
    console.log('Launching chromium');

    global.browser = await playwright['chromium'].launch();
  } catch(e) {
    console.log('Error launching chromium');
    console.log(e);
  }
});

after(async() => {
  try {
    console.log('Closing chromium');
    return await browser.close();
  } catch (e) {
    console.log('Error closing chromium');
    console.log(e);
  }
});

beforeEach(async() => {
  try {
    global.page = await browser.newPage();
  } catch (e) {
    console.log('Error opening page.');
    console.log(e);
  }
});

afterEach(async() => {
  try {
    await page.close();
  } catch (e) {
    console.log('Error closing page.');
    console.log(e);
  }
});

global.submitPage = async() => {
  const submit = await page.$('input[type="submit"]');
  await submit.click();
  await page.waitForLoadState();
};

// Reusable function which selects first option in radio button and submits
global.submitRadio = async() => {
  const radio = await page.$('input[type="radio"]');
  await radio.check();
  submitPage();
};
