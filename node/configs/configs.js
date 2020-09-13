/****************************
 Configuration
 ****************************/
module.exports = {
    mongoDBOptions : {
        reconnectTries:  Number.MAX_VALUE,
        reconnectInterval:  1000,
        keepAlive:  1,
        connectTimeoutMS:  30000,
        useMongoClient:  true,
        native_parser: true ,
        poolSize: 5,
        //user: 'Text',
        //pass: 'Text123'
    },
    sessionSecret: 'Text123',
    securityToken: 'Text123',
    baseApiUrl: '/api',
    tokenExpiry: 361440
};
