module.exports = {
    namespace: process.env.MOLECULER_NAMESPACE || 'dabomb',
    nodeName: process.env.NODE_NAME || 'game',
    db: {
        connectionString: process.env.DB_CONNECTION_STRING ||
            'postgresql://local:12345678@127.0.0.1:5432/dabomb'
    } 
};