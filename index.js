require('dotenv').config();
/**
 * Finger Farm...
 * ... by Jon Roig / https://jonroig.com
 * 
 * 
 */
const express = require('express');
const exphbs  = require('express-handlebars');
const cookieSession = require('cookie-session');
const passport = require('./auth'); // this triggers strategy registration
const helmet = require('helmet');

const app = express();
const { config } = require('./config');
const fingerServer = require('./lib/fingerserver');

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(helmet({ contentSecurityPolicy: false })); // disable CSP for now so we don't break existing inline scripts in handlebars
app.use(express.static('public'));

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // one day in miliseconds
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'fallback_secret_key_1']
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/', apiRoutes);
app.use('/', htmlRoutes);
 
app.listen(config.webServer.httpPort, (err) => {
    if (err) {
        console.log(`Could not start http server on port ${config.webServer.httpPort}`);
        return;
    }
    
    console.log(`HTTP server started on port ${config.webServer.httpPort}`);
});