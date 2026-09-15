const baseUrl = process.env.BASE_URL || 'https://finger.farm';

module.exports = {
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
        icon: 'fa-gamepad', 
        btnClass: 'btn-primary'
    },
    gitlab: {
        enabled: !!process.env.GITLAB_CLIENT_ID,
        Strategy: require('passport-gitlab2').Strategy,
        config: {
            clientID: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/gitlab/callback`
        },
        name: 'GitLab',
        icon: 'fa-gitlab',
        btnClass: 'btn-warning'
    },
    facebook: {
        enabled: !!process.env.FACEBOOK_CLIENT_ID,
        Strategy: require('passport-facebook').Strategy,
        config: {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/facebook/callback`
        },
        name: 'Facebook',
        icon: 'fa-facebook',
        btnClass: 'btn-primary'
    },
    microsoft: {
        enabled: !!process.env.MICROSOFT_CLIENT_ID,
        Strategy: require('passport-microsoft').Strategy,
        config: {
            clientID: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/microsoft/callback`,
            scope: ['user.read']
        },
        name: 'Microsoft',
        icon: 'fa-windows',
        btnClass: 'btn-info'
    },
    linkedin: {
        enabled: !!process.env.LINKEDIN_CLIENT_ID,
        Strategy: require('passport-linkedin-oauth2').Strategy,
        config: {
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/linkedin/callback`,
            scope: ['r_emailaddress', 'r_liteprofile']
        },
        name: 'LinkedIn',
        icon: 'fa-linkedin',
        btnClass: 'btn-primary'
    },
    twitch: {
        enabled: !!process.env.TWITCH_CLIENT_ID,
        Strategy: require('passport-twitch-new').Strategy,
        config: {
            clientID: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/twitch/callback`,
            scope: ['user_read']
        },
        name: 'Twitch',
        icon: 'fa-twitch',
        btnClass: 'btn-info'
    },
    spotify: {
        enabled: !!process.env.SPOTIFY_CLIENT_ID,
        Strategy: require('passport-spotify').Strategy,
        config: {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/spotify/callback`
        },
        name: 'Spotify',
        icon: 'fa-spotify',
        btnClass: 'btn-success'
    },
    slack: {
        enabled: !!process.env.SLACK_CLIENT_ID,
        Strategy: require('passport-slack-oauth2').Strategy,
        config: {
            clientID: process.env.SLACK_CLIENT_ID,
            clientSecret: process.env.SLACK_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/slack/callback`,
            scope: ['identity.basic']
        },
        name: 'Slack',
        icon: 'fa-slack',
        btnClass: 'btn-danger'
    },
    bitbucket: {
        enabled: !!process.env.BITBUCKET_CLIENT_ID,
        Strategy: require('passport-bitbucket-oauth2').Strategy,
        config: {
            clientID: process.env.BITBUCKET_CLIENT_ID,
            clientSecret: process.env.BITBUCKET_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/bitbucket/callback`
        },
        name: 'Bitbucket',
        icon: 'fa-bitbucket',
        btnClass: 'btn-info'
    },
    amazon: {
        enabled: !!process.env.AMAZON_CLIENT_ID,
        Strategy: require('passport-amazon').Strategy,
        config: {
            clientID: process.env.AMAZON_CLIENT_ID,
            clientSecret: process.env.AMAZON_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/amazon/callback`,
            scope: ['profile']
        },
        name: 'Amazon',
        icon: 'fa-amazon',
        btnClass: 'btn-warning'
    },
    dropbox: {
        enabled: !!process.env.DROPBOX_CLIENT_ID,
        Strategy: require('passport-dropbox-oauth2').Strategy,
        config: {
            clientID: process.env.DROPBOX_CLIENT_ID,
            clientSecret: process.env.DROPBOX_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/dropbox/callback`
        },
        name: 'Dropbox',
        icon: 'fa-dropbox',
        btnClass: 'btn-primary'
    },
    reddit: {
        enabled: !!process.env.REDDIT_CLIENT_ID,
        Strategy: require('passport-reddit').Strategy,
        config: {
            clientID: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            callbackURL: `${baseUrl}/auth/reddit/callback`
        },
        name: 'Reddit',
        icon: 'fa-reddit',
        btnClass: 'btn-danger'
    }
};
