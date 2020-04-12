module.exports = {
    namespace: process.env.MOLECULER_NAMESPACE || 'dabomb',
    gateway: {
        ip: process.env.IP_ADDRESS || '0.0.0.0',
        port: process.env.GATEWAY_PORT || 3000
    }
}