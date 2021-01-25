const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const config = require('../config').config;
const init = require('./init');
const connection = require('../connection');
const { nanoid } =  require('nanoid');


passport.use(new GitHubStrategy({
    clientID: config.passport.github.clientID,
    clientSecret: config.passport.github.clientSecret,
    callbackURL: config.passport.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {    

    // check to see if the user already exists...
    let message = 'Internal server error';
    connection.all("SELECT * FROM users WHERE ext_id = ? AND authsource = 'github' ", [profile.id], (err, users) => {
      if (err) {
        console.log('err', err);
        return done({ message, statusCode: 500 }, null);
      }

      const user = users[0];
      
      // user exists? Cool... send 'em along their way
      if (user) {
        return done(null, user);
      }

      // create the new user
      const newUser = {
        displayname: profile.displayName,
        ext_id: profile.id,
        token: nanoid(48), 
      }

      connection.run(`
        INSERT INTO users 
        (displayname, ext_id, token, authsource) 
        VALUES 
        (?, ?, ?, 'github')`
        , [newUser.displayname, newUser.ext_id, newUser.token], function (err) {
          if (err) {
              console.log('err: ', err);
              return done({ message: 'Internal server error', statusCode: 500 }, null)
          }
      
          newUser.id = this.lastID;
          return done(null, newUser);
        });
    });
  }

));

// serialize user into the session
init();


module.exports = passport;