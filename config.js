require('dotenv').config();
const fs = require('fs');

const baseUrl = process.env.BASE_URL || 'https://finger.farm';

exports.config = {
    baseUrl: baseUrl,
    baseFingerHost: process.env.BASE_FINGER_HOST || 'finger.farm',

    // Dynamic Passport Strategies
    passportStrategies: {
        github: {
            enabled: !!process.env.GITHUB_CLIENT_ID,
            Strategy: require('passport-github2').Strategy,
            config: {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: `${baseUrl}/auth/github/callback`
            },
            name: 'GitHub',
            icon: 'fa-github',
            btnClass: 'btn-dark'
        },
        google: {
            enabled: !!process.env.GOOGLE_CLIENT_ID,
            Strategy: require('passport-google-oauth20').Strategy,
            config: {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${baseUrl}/auth/google/callback`,
                scope: ['profile', 'email']
            },
            name: 'Google',
            icon: 'fa-google',
            btnClass: 'btn-danger'
        },
        discord: {
            enabled: !!process.env.DISCORD_CLIENT_ID,
            Strategy: require('passport-discord').Strategy,
            config: {
                clientID: process.env.DISCORD_CLIENT_ID,
                clientSecret: process.env.DISCORD_CLIENT_SECRET,
                callbackURL: `${baseUrl}/auth/discord/callback`,
                scope: ['identify']
            },
            name: 'Discord',
            icon: 'fa-discord', // You might need a specific discord font-awesome icon if it exists, otherwise a generic icon or custom CSS
            btnClass: 'btn-primary'
        }
    },
    
    // finger config
    fingerServer: {
        port: process.env.FINGER_PORT || 7979,
    },

    // web config
    webServer: {
        httpPort: process.env.PORT || 3000,
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
        id: process.env.GA_ID || 'XXXX'
    }
};
