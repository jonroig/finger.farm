const passport = require('passport');
const { config } = require('../config');
const db = require('../connection');
const strategies = require('./strategies');
const { nanoid } = require('nanoid');
require('./init')();

Object.keys(strategies).forEach(providerName => {
    const provider = strategies[providerName];
    if (provider.enabled) {
        passport.use(new provider.Strategy(provider.config, async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await db.getUserByExtId(profile.id, providerName);
                
                if (user) {
                    return done(null, user);
                }

                if (!config.allowRegistration) {
                    return done(null, false, { message: 'Registration is currently disabled.' });
                }

                // create the new user
                const newUser = {
                    displayname: profile.displayName || profile.username || 'User',
                    ext_id: profile.id,
                    token: nanoid(48), 
                    authsource: providerName
                };

                const newUserId = await db.createUser(newUser);
                newUser.id = newUserId;
                return done(null, newUser);
            } catch (err) {
                console.log('err', err);
                return done({ message: 'Internal server error', statusCode: 500 }, null);
            }
        }));
    }
});

module.exports = passport;
