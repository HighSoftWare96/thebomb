const ApiGateway = require("moleculer-web");
const { gateway } = require('config');
const routes = require('routes');

console.log(require('config'));

module.exports = {
  name: "api",
  mixins: [ApiGateway],
  settings: {
    port: gateway.port,
    ip: gateway.ip,
    use: [],
    routes,

    log4XXResponses: false,
    logRequestParams: null,
    logResponseData: null,

    assets: {
      folder: "public",
      options: {}
    }
  },
  methods: {
  }
};
