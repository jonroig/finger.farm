
const fs = require('fs');

exports.config = {
    baseUrl: 'https://finger.farm',
    baseFingerHost: 'finger.farm',

    // oauth stuff
    passport: {
        github: {
            clientID: 'CHANGE_ME',
            clientSecret: 'CHANGE_ME',
            callbackURL: 'https://finger.farm/auth/github/callback'
        },
        twitter: {
            apiKey: 'CHANGE_ME',
            apiSecret: 'CHANGE_ME',
            callbackURL: 'https://finger.farm/auth/twitter/callback'
        }
    },
    
    // finger config
    fingerServer: {
        port: 7979,
    },

    // web config
    webServer: {
        httpPort: 3000,
    },

    defaultUsers: {
        help: {
            name: 'Clippy',
            plan: fs.readFileSync('./views/finger/help.txt', 'utf8')
        },
        about: {
            name: 'Abouty McAboutface',
            plan: fs.readFileSync('./views/finger/about.txt', 'utf8')
        },
        info: {
            name: 'Gary the Marauder',
            plan: fs.readFileSync('./views/finger/about.txt', 'utf8')
        },
        finger: {
            name: 'The Finger',
            plan: fs.readFileSync('./views/finger/finger.txt', 'utf8')
        }
    },

    // google analytics
    ga: {
        id: 'XXXX'
    }
};
