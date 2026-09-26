const fs = require('fs');
const express = require('express');
const cors = require('cors');
const router = express.Router();

const config = require('../config').config;
const db = require('../connection');
const botManager = require('../lib/botManager');
const fingerWelcome = fs.readFileSync('./views/finger/welcome.txt', 'utf8');


// WebFinger Support (RFC 7033)
router.get('/.well-known/webfinger', cors(), async (req, res) => {
    try {
        const resource = req.query.resource;
        if (!resource || !resource.startsWith('acct:')) {
            return res.status(400).json({ message: 'Invalid or missing resource parameter', statusCode: 400 });
        }

        const username = resource.replace('acct:', '').split('@')[0];
        const cleanUsername = username.toLowerCase().trim();

        let user;
        const bot = botManager.getBot(cleanUsername);
        if (bot) {
            const context = { username: cleanUsername, ip: req.ip, config, db };
            user = await botManager.handle(bot, context);
        } else {
            user = await db.getUserByUsername(cleanUsername);
        }

        if (!user) {
            return res.status(404).json({ message: 'Not found', statusCode: 404 });
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers.host;
        const baseUrl = `${protocol}://${host}`;

        return res.json({
            subject: `acct:${user.username}@${config.baseFingerHost}`,
            aliases: [
                `${baseUrl}/api/${user.username}/html`,
                `${baseUrl}/api/${user.username}`
            ],
            links: [
                {
                    rel: "http://webfinger.net/rel/profile-page",
                    type: "text/html",
                    href: `${baseUrl}/api/${user.username}/html`
                },
                {
                    rel: "self",
                    type: "application/json",
                    href: `${baseUrl}/api/${user.username}`
                }
            ]
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', statusCode: 500 });
    }
});

// api get endpoint for JSON... the rough equivalent of running finger somebody@finger.farm

router.get('/api/:username', cors(), async (req, res) => {
    try {
        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();
        
        let user;
        const bot = botManager.getBot(cleanUsername);
        if (bot) {
            const context = { username: cleanUsername, ip: req.ip, config, db };
            user = await botManager.handle(bot, context);
        } else {
            user = await db.getUserByUsername(cleanUsername);
        }
        
        if (!user) {
            return res.status(404).json({
                message: 'Not found',
                statusCode: 404
            });
        }

        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Error',
            statusCode: 500
        });
    }
});

router.get('/api/:username/html', cors(), async (req, res) => {
    try {
        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();
        
        let user;
        const bot = botManager.getBot(cleanUsername);
        if (bot) {
            const context = { username: cleanUsername, ip: req.ip, config, db };
            user = await botManager.handle(bot, context);
        } else {
            user = await db.getUserByUsername(cleanUsername);
        }
        
        if (!user) {
            return res.status(404).json({
                message: 'Not found',
                statusCode: 404
            });
        }

        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        
        return res.render('html', {
            ...user,
            fingerWelcome,
            config,
            layout: false
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Error',
            statusCode: 500
        });
    }
});

// Reject cross-site browser requests forged with the victim's cookies while still
// allowing non-browser API clients (e.g. curl), which do not send an Origin header.
function isTrustedOrigin(req) {
    const origin = req.get('origin') || req.get('referer');
    if (!origin) return true;
    return origin.toLowerCase().startsWith(config.baseUrl.toLowerCase());
}

router.options('/api/:username/project', cors());
router.put('/api/:username/project', cors(), async (req, res) => {
    try {
        if (!isTrustedOrigin(req)) {
            return res.status(403).json({ status: 403, message: 'Invalid origin' });
        }

        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();

        const validUser = await db.getUserByToken(cleanUsername, req.body.token);
        if (!validUser) {
            const message = "Invalid user / token";
            return res.status(404).json({ status: 404, message });
        }

        await db.updateProjectByToken(cleanUsername, req.body.token, req.body.data);
        
        const user = await db.getUserByUsername(cleanUsername);
        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        
        return res.status(200).json( {status: 200, user} );
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal error' });
    }
});

router.options('/api/:username/plan', cors());
router.put('/api/:username/plan', cors(), async (req, res) => {
    try {
        if (!isTrustedOrigin(req)) {
            return res.status(403).json({ status: 403, message: 'Invalid origin' });
        }

        const username = req.params.username || '';
        const cleanUsername = username.toLowerCase().trim();

        const validUser = await db.getUserByToken(cleanUsername, req.body.token);
        if (!validUser) {
            const message = "Invalid user / token";
            return res.status(404).json({ status: 404, message });
        }

        await db.updatePlanByToken(cleanUsername, req.body.token, req.body.data);
        
        const user = await db.getUserByUsername(cleanUsername);
        delete user.id;
        delete user.passwordcrypt;
        delete user.token;
        delete user.ext_id;
        delete user.authsource;
        
        return res.status(200).json( {status: 200, user} );
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal error' });
    }
});

module.exports = router;
