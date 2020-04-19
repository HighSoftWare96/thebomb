module.exports = {
  namespace: process.env.MOLECULER_NAMESPACE || 'dabomb',
  nodeName: process.env.NODE_NAME || 'gateway',
  gateway: {
    ip: process.env.IP_ADDRESS || '0.0.0.0',
    port: process.env.GATEWAY_PORT || 3000
  },
  jwt: {
    secret: 'C-qn35=J!$=k*G)NzKxkbV2v@KWZ[Ga(',
    expiresInMinutes: 1440,
    notBefore: 0,
    audience: 'dabomb:authentication',
    issuer: 'partecipant.service',
    secure: true
  }
};
