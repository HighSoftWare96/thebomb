module.exports = {
    namespace: process.env.MOLECULER_NAMESPACE || 'dabomb',
    nodeName: process.env.NODE_NAME || 'rooms',
    gateway: {
        ip: process.env.IP_ADDRESS || '127.0.0.1',
        port: process.env.GATEWAY_PORT || 3000
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING ||
            'postgresql://local:12345678@127.0.0.1:5432/dabomb'
    },
    socketio: {
        ip: process.env.SOCKETIO_IP_ADDRESS || '127.0.0.1',
        port: process.env.SOCKETIO_PORT || 3001
    }
}