require('dotenv').config();

const baseUrl = process.env.BASE_URL || 'https://finger.farm';

exports.config = {
    baseUrl: baseUrl,
    baseFingerHost: process.env.BASE_FINGER_HOST || 'finger.farm',
    allowRegistration: process.env.ALLOW_REGISTRATION !== 'false',
    
    // finger config
    fingerServer: {
        port: process.env.FINGER_PORT || 7979,
    },

    // web config
    webServer: {
        httpPort: process.env.PORT || 3000,
    },

    // google analytics
    ga: {
        id: process.env.GA_ID || 'XXXX'
    }
};
