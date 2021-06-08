'use strict';
/* eslint-disable no-process-env */

const hof = require('hof');

const settings = require('./hof.settings');

if (process.env.REDIS_URL) {
  settings.redis = process.env.REDIS_URL;
}

settings.routes = settings.routes.map(route => require(route));
settings.root = __dirname;
settings.start = false;

module.exports = hof(settings);
