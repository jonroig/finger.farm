require('dotenv').config();


exports.config = {
    // base config
    baseUrl: process.env.BASE_URL || 'https://finger.farm';,
    baseFingerHost: process.env.BASE_FINGER_HOST || 'finger.farm',

    // site configuration
    allowRegistration: process.env.ALLOW_REGISTRATION === undefined ? true : process.env.ALLOW_REGISTRATION === 'true',
    showPublicUsers: process.env.SHOW_PUBLIC_USERS === 'true',

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
