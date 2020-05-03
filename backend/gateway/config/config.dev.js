module.exports = {
  namespace: process.env.MOLECULER_NAMESPACE || 'thebomb',
  nodeName: process.env.NODE_NAME || 'gateway',
  gateway: {
    ip: process.env.IP_ADDRESS || '127.0.0.1',
    port: process.env.GATEWAY_PORT || 3000
  },
  jwt: {
    secret: 'tW(@&aX4D;H?2`;"D,;:jqg?k;[4jHa(',
    expiresInMinutes: 1440,
    notBefore: 0,
    audience: 'DEV_thebomb:authentication',
    issuer: 'partecipant.service',
    secure: false
  }
};
