module.exports = {
    port: '5757',
    ROUTE_BASE_PATH: '/applet',

    sessionConfig: {
        appId: '', // 微信小程序 App ID
        appSecret: '', // 微信小程序 App Secret

        // Redis 配置
        // @see https://www.npmjs.com/package/redis#options-object-properties
        redisConfig: {
            host: '',
            port: '',
            password: '',
        },
    },

    // MongoDB配置
    // @see https://www.qcloud.com/doc/product/240/3979
    mongoConfig: {
        username: '',
        password: '',
        host: '',
        port: '',
        query: '?authMechanism=MONGODB-CR&authSource=admin',
        database: 'qcloud-applet-session',
    },
};