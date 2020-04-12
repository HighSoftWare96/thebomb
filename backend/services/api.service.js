"use strict";

const ApiGateway = require("moleculer-web");
const { gateway } = require('../config');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
  name: "api",
  mixins: [ApiGateway],

  // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
  settings: {
    // Exposed port
    port: gateway.port,

    // Exposed IP
    ip: gateway.ip,

    // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
    use: [],

    routes: [
      {
        path: "/api",

        whitelist: [
          "**"
        ],

        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],

        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,

        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: false,

        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: false,

        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,

        aliases: {

        },

        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callingOptions: {},

        bodyParsers: {
          json: {
            strict: false,
            limit: "1MB"
          },
          urlencoded: {
            extended: true,
            limit: "1MB"
          }
        },

        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        mappingPolicy: "restrict", // Available values: "all", "restrict"

        // Enable/disable logging
        logging: true
      }
    ],

    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    log4XXResponses: false,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,


    // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
    assets: {
      folder: "public",

      // Options to `server-static` module
      options: {}
    }
  },
  methods: {
  }
};
