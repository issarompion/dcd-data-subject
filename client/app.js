const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const refresh = require('passport-oauth2-refresh');
const path = require('path')


const app = express();

//cors for angular app
const cors = require('cors')
app.use(cors())

// To have access to .env file
require('dotenv').config()

const baseUrl = process.env.BASE_URL || '';

const serverUrl = process.env.SERVER_URL;

const backends = {
  api: process.env.API_URL
};

const passport = require('passport');
// const OAuth2Strategy = require('passport-oauth2')
const Strategy = require('./passport-dcd/passport-dcd').Strategy;

const strategyOptions = {
  authorizationURL: process.env.OAUTH2_AUTH_URL,
  tokenURL: process.env.OAUTH2_TOKEN_URL,
  clientID: process.env.OAUTH2_CLIENT_ID,
  clientSecret: process.env.OAUTH2_CLIENT_SECRET,
  callbackURL: process.env.OAUTH2_REDIRECT_URL,
  userProfileURL: process.env.OAUTH2_PROFILE,
  state: true,
  scope: ['offline', 'openid', 'profile', 'dcd:things', 'dcd:persons']
};

passport.use('oauth2', new Strategy(strategyOptions,
  (accessToken, refreshToken, profile, cb) => cb(null, {accessToken, profile})
));
passport.use('refresh', refresh);

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user))
});

passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user))
});

// view engine setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// These are middlewares required by passport js
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());


// This is a middleware that checks if the user is authenticated. It also remembers the URL so it can be used to
// redirect to it after the user authenticated.
const checkAuthentication = (req, res, next) => {
    // The `isAuthenticated` is available because of Passport.js
    if (!req.isAuthenticated()) {
        req.session.redirectTo = req.url;
        res.redirect(baseUrl + '/auth');
        return
    }
    next()
  };

  app.use(express.static(__dirname+'/dist/client'))


  /*app.get('/*',checkAuthentication,  
    async (req, res, next) => {
      console.log('/*')
    });*/

  app.get(baseUrl,checkAuthentication,    
  async (req, res, next) => {
    console.log('basurl')
    res.sendFile(path.join(__dirname));
  });


  app.get(baseUrl+'/auth', passport.authenticate('oauth2'));

  app.get(baseUrl+'/auth/callback',
  
  passport.authenticate('oauth2',
  {failureRedirect: baseUrl + '/auth'}),
  (req, res) => {
  // After success, redirect to the page we came from originally
  console.log('/auth/callback ' + req.session.redirectTo);
  res.redirect(req.session.redirectTo)
  }
  );
  
  //This shows home page
  app.get('/error', (req, res) => {
      res.render('error', {
          backends: backends,
          baseUrl: serverUrl + baseUrl,
          message: 'Unknown Error',
          error: {status: 0}
      })
  });
  
  module.exports = app;