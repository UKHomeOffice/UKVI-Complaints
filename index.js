/* eslint-disable no-process-env */
'use strict';
const hof = require('hof');

const addDynamicSettings = (settings) => {
  settings.routes = settings.routes.map(route => require(route));
  settings.root = __dirname;
  settings.start = false;

  // suppress logs when running the app in silent mode for automation testing, so app logs do not mix with test logs
  if (process.argv.some(commandLineArgument => commandLineArgument === '\silent')) {
    settings.loglevel = 'silent';
  }

  if (process.env.REDIS_URL) {
    settings.redis = process.env.REDIS_URL;
  }

  return settings;
};

/*
 During automation test setup, we ping the app with '?automation-test' query to check it is ready before running tests.
 Put a cookie on this request so it doesn't fail HOF-middleware cookie check.
*/
const addAutomationTestCookie = (req, res, next) => {
  if (req.query['automation-test'] !== undefined) {
    req.cookies.testCookie = 'test';
  }
  return next();
};

const app = hof(addDynamicSettings(require('./hof.settings')));
app.use('/reason', (req, res, next) => addAutomationTestCookie(req, res, next));

module.exports = app;
