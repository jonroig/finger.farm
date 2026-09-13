const express = require('express');
const router = express.Router();
const passport = require('passport');
const { config } = require('../config');

// Setup dynamic routes for enabled providers
Object.keys(config.passportStrategies).forEach(providerName => {
    const provider = config.passportStrategies[providerName];
    if (provider.enabled) {
        const scope = provider.config.scope || [];
        router.get(`/auth/${providerName}`, passport.authenticate(providerName, { scope }));
        
        router.get(`/auth/${providerName}/callback`,
            passport.authenticate(providerName, { failureRedirect: '/' }),
            (req, res) => {
                // Successful authentication
                return res.redirect('/profile');
            }
        );
    }
});

// Logout route
router.get('/logout', function (req, res) {
    req.logout();
    req.session = null;
    res.redirect('/');
});

module.exports = router;
