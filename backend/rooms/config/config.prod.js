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
    }
}