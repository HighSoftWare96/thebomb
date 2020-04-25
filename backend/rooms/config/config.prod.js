module.exports = {
  namespace: process.env.MOLECULER_NAMESPACE || 'dabomb',
  nodeName: process.env.NODE_NAME || 'rooms',
  gateway: {
    ip: process.env.IP_ADDRESS || '0.0.0.0',
    port: process.env.GATEWAY_PORT || 3000
  },
  db: {
    connectionString: process.env.DB_CONNECTION_STRING || 'Data Source=./dabom_db;Version=3;'
  },
  socketio: {
    ip: process.env.SOCKETIO_IP_ADDRESS || '0.0.0.0',
    port: process.env.SOCKETIO_PORT || 3001
  },
  jwt: {
    secret: 'tW(@&aX4D;a.ksjhdlauisgdliuagsdaH?2`;"D,;:jqg?k;[4jHa(',
    expiresInMinutes: 1440,
    notBefore: 0,
    audience: 'dabomb:authentication',
    issuer: 'partecipant.service',
  },
  refreshJwt: {
    secret: 'tW(@&aX4D;Hàgpihjfòpoguushdliufghsiudfisluyove7tyor87v6t39b?2`;"D,;:jqg?k;[4jHa(',
    expiresInMinutes: 10080,
    notBefore: 0,
    audience: 'dabomb:session',
    issuer: 'session.service',
    secure: true
  }
};