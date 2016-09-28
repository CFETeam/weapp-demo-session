module.exports = {
    port: '5757',
    ROUTE_BASE_PATH: '/applet',

    // 微信小程序 App ID
    appId: '',

    // 微信小程序 App Secret
    appSecret: '',

    // Redis 配置
    // @see https://www.npmjs.com/package/redis#options-object-properties
    redisConfig: {
        host: '',
        port: '',
        password: '',
    },

    // MongoDB 配置
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