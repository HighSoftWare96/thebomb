const ApiGateway = require("moleculer-web");
const { gateway, jwt: jwtConfig } = require('config');
const routes = require('routes');
const jwt = require('jsonwebtoken');
const freeRoutes = require('routes/free-routes');
const { unauth } = require('helpers/errors');

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
    async authenticate(ctx, route, req) {
      try {
        const {
          secret, notBefore, expiresInMinutes, issuer, audience
        } = jwtConfig;

        const cookieSession = req.cookies.partecipant_auth;

        const decoded = jwt.verify(cookieSession, secret, {
          algorithm: 'HS256',
          expiresIn: expiresInMinutes * 60,
          notBefore: notBefore,
          issuer: issuer,
          audience: audience
        });

        const partecipant = await ctx.broker.call('partecipant.get', {
          id: decoded.id
        });

        return partecipant;
      } catch (e) {
        return null;
      }
    },
    async authorize(ctx, route, req) {
      const { user } = ctx.meta;
      const endpointPath = req.$endpoint.action.name;

      if (!user && freeRoutes[endpointPath]) {
        return Promise.resolve(true);
      } else if (user) {
        return true;
      } else {
        return Promise.reject(unauth());
      }
    }
  }
};
