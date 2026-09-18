const express = require('express');
const router = express.Router();
const passport = require('passport');
const strategies = require('../auth/strategies');

// Setup dynamic routes for enabled providers
Object.keys(strategies).forEach(providerName => {
    const provider = strategies[providerName];
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
