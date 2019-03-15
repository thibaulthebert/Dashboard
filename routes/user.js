//Imports needed in this file, with the strategies
const express = require('express');
const router = express.Router();
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy
const TwitchtvStrategy = require('passport-twitchtv').Strategy
var LocalStrategy = require('passport-local').Strategy;
const authKeys = require('./authKeys')

var User = require('../models/user');

//Rendering the register page
router.get('/register', function(req, res) {
    res.render('register');
});

//Rendering the login page
router.get('/login', function(req, res) {
    res.render('login');
});

//Post register request
router.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Basic error handling
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //Checking if the username or the email address are already taken
  User.findOne({username: username}, function(err, userRegistered) {
    if (userRegistered != null) {
      req.checkBody('username', 'Name is already in use').equals("");
      var errors = req.validationErrors();
      res.render('register',{errors:errors});
      return;
    } else {
      User.findOne({email: email}, function(err, emailGiven) {
        if (emailGiven != null) {
          req.checkBody('email', 'Email is already in use').equals("");
          var errors = req.validationErrors();
          res.render('register',{errors:errors});
          return;
        } else {
          var errors = req.validationErrors();

          if (errors){
            res.render('register',{errors:errors});
          } else {
            var newUser = new User({
              name: name,
              email:email,
              username: username,
              password: password
            });
          User.createUser(newUser, function(err, user){
              if(err) throw err;
              console.log(user);
            });
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/users/login');
        }
        }
      });
    }
  });
});

//Defining the local strategy
passport.use (new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));

//Defining the Twitch's service connection strategy
passport.use(new TwitchtvStrategy({
  clientID: authKeys.twitchAuth.clientID,
  clientSecret: authKeys.twitchAuth.clientSecret,
  callbackURL: authKeys.twitchAuth.callbackURL,
  scope: authKeys.twitchAuth.scope,
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  User.findOne({'username': req.user.name}, function(err, user) {
    if (err)
      return done(err);
    if (user) {
      console.log(profile);
      req.user.twitchName = profile.username;
      req.user.save(function(err) {
        if (err)
          throw err;
        return done(null, err);
      });
    }
  });
}
));

//Defining the Steam's service connection strategy
passport.use(new SteamStrategy({
  returnURL: authKeys.steamAuth.returnURL,
  realm: authKeys.steamAuth.realm,
  apiKey: authKeys.steamAuth.apiKey,
  passReqToCallback: true
},
function(req, identifier, profile, done) {
  User.findOne({'username' : req.user.name}, function(err, user) {
    if (err)
      return done(err);
    if (user) {
      console.log(identifier);
      req.user.steamId = identifier.split(/\/+/).pop();
      req.user.steamName = profile.displayName;
      req.user.save(function(err) {
        if (err)
          throw err;
        return done(null, err);
      })
    }
    else {
      return done(null, user);
    }
  });
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
router.post(
  '/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
    }),
  function(req, res) {
    res.redirect('/');
  });


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;