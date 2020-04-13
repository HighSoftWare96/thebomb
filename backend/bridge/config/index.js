const { NODE_ENV } = process.env;
let config = require('./config.prod');
const { merge } = require('lodash');

if (NODE_ENV.includes('dev')) {
    const configDev = require('./config.dev');
    config = merge(config, configDev);
}

module.exports = config;