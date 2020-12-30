module.exports = {
  namespace: process.env.MOLECULER_NAMESPACE || 'thebomb',
  nodeName: process.env.NODE_NAME || 'rooms',
  gateway: {
    ip: process.env.IP_ADDRESS || '0.0.0.0',
    port: process.env.GATEWAY_PORT || 3000
  },
  db: {
    connectionString: process.env.DB_CONNECTION_STRING || 'postgresql://local:12345678@127.0.0.1:5432/thebomb'
  },
  socketio: {
    ip: process.env.SOCKETIO_IP_ADDRESS || '0.0.0.0',
    port: process.env.SOCKETIO_PORT || 3001
  },
  jwt: {
    secret: 'tW(@&aX4D;a.ksjhdlauisgdliuagsdaH?2`;"D,;:jqg?k;[4jHa(',
    expiresInMinutes: 1440,
    notBefore: 0,
    audience: 'thebomb:authentication',
    issuer: 'partecipant.service',
  },
  refreshJwt: {
    secret: 'tW(@&aX4D;Hàgpihjfòpoguushdliufghsiudfisluyove7tyor87v6t39b?2`;"D,;:jqg?k;[4jHa(',
    expiresInMinutes: 10080,
    notBefore: 0,
    audience: 'thebomb:session',
    issuer: 'session.service',
    secure: process.env.COOKIE_SECURE !== undefined ? 
      /(true)|(1)/gi.test(process.env.COOKIE_SECURE) : true
  }
};