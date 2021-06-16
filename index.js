'use strict';
/* eslint-disable no-process-env */

const hof = require('hof');

const addDynamicSettings = (settings) => {
  settings.routes = settings.routes.map(route => require(route));
  settings.root = __dirname;
  settings.start = false;

  if (process.env.REDIS_URL) {
    settings.redis = process.env.REDIS_URL;
  }

  return settings;
};

const app = hof(addDynamicSettings(require('./hof.settings')));

app.use((req, res, next) => {
  // set service name for cookie banner
  res.locals.serviceName = 'UKVI Complaints';
  next();
});

module.exports = app;
