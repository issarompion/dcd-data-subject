// src/server.ts
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as refresh from 'passport-oauth2-refresh'
import * as passport from 'passport'
import * as dcd from './passport-dcd/passport-dcd'
import * as dotenv from 'dotenv'
import * as findconfig from 'find-config'

const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
//
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server/main');

const PORT = process.env.PORT || 8080;

console.log(process.env.OAUTH2_PROFILE)

const mode = (process.argv[2] === '--dev') ? 'development' : 'production';

const app = express();
if (mode === 'production') {
    enableProdMode();
    app.disable('x-powered-by');
}

const template = readFileSync(join(__dirname, '..', 'dist', 'browser', 'index.html')).toString();


// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

dotenv.config({ path: findconfig('.env') })
console.log(process.env.OAUTH2_PROFILE)

const baseUrl = process.env.BASE_URL || '';

const serverUrl = process.env.SERVER_URL;

const backends = {
  api: process.env.API_URL
};

const Strategy = dcd.Strategy

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


const DIST_FOLDER = join(process.cwd(), 'dist');



// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('/',(req, res) => {
res.redirect(baseUrl + '/');
});

app.get(baseUrl+'/',checkAuthentication,
async (req, res, next) => {
    res.render('index', { req });
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

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

