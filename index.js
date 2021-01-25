
/**
 * Finger Farm...
 * ... by Jon Roig / https://jonroig.com
 * 
 * 
 */
const express = require('express');
const exphbs  = require('express-handlebars');
const cookieSession = require('cookie-session');
var passport = require('passport');

const app = express();
const config = require('./config').config;
const fingerServer = require('./lib/fingerserver');

const authenticationRoute = require('./routes/authentication');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use(express.static('public'));

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // one day in miliseconds
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authenticationRoute);
app.use('/', apiRoutes);
app.use('/', htmlRoutes);
 
app.listen(config.webServer.httpPort, (err) => {
    if (err) {
        console.log(`Could not start http server on port ${config.webServer.httpPort}`);
        return;
    }
    
    console.log(`HTTP server started on port ${config.webServer.httpPort}`);
});