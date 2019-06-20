import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
import { renderModuleFactory } from '@angular/platform-server'
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';

import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as refresh from 'passport-oauth2-refresh'
import * as passport from 'passport'
import * as dcd from './dcd/passport-dcd/passport-dcd' //trouver un moyen d'inclure ça dans le dist
import * as dotenv from 'dotenv'
import * as findconfig from 'find-config'
import * as fetch from 'node-fetch'

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

dotenv.config({ path: findconfig('.env') })

// Express server
const app = express();

const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), 'dist');

//Oauth2
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
        res.redirect(baseUrl+'/auth');
          return
      }
      next()
    };

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
/*app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ],
  //extraProviders:[]
}));*/

/*app.engine('html', (_, options, callback) => {
  let serverUrl = options.req.protocol + '://' + options.req.get('host');
  
    renderModuleFactory(AppServerModuleNgFactory, {
      //...
      extraProviders: [
        provideModuleMap(LAZY_MODULE_MAP),
        {
          provide: 'serverUrl',
          useValue: serverUrl
        }
      ]
    }).then(html => {
      //...
    });
  });*/
  import { readFileSync } from 'fs';
  const template = readFileSync(join(__dirname, '..', 'dist', 'browser', 'index.html')).toString();
  app.engine('html', (_, options, callback) => {
    const opts = {
        document: template,
        url: options.req.url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP),
            {
              provide: 'serverUrl',
              useValue: serverUrl
            },
            {
              provide: 'token',
              useValue: options.req.user.accessToken
            },
        ]
    };
    renderModuleFactory(AppServerModuleNgFactory, opts)
        .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine

/*app.get('*', (req, res) => {
  res.render('index', { req });
});*/

app.get('/api/hello'//,checkAuthentication
,(req, res) => {
  console.log(req.headers)
  res.send({data:"hello"})
  });

app.get('/',(req, res) => {
res.redirect(baseUrl + '/');
});

app.get(baseUrl+'/',checkAuthentication,
async (req, res, next) => {
  //console.log(req)
    res.render('index', { req });
});
// page because the redirection of '/*' crash beacuase there are many other redirection  
app.get(baseUrl+'/page/*',checkAuthentication,
async (req, res, next) => {
    //console.log(req)
    res.render('index', { req });
});

app.get(baseUrl+'/auth', passport.authenticate('oauth2'));

app.get(baseUrl+'/auth/callback',

passport.authenticate('oauth2',
{failureRedirect: '/auth'}),
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

//Recup data
app.get('/things', //checkAuthentication,
    async (req, res, next) => {
        const thingAPI = backends.api + '/things';
        const data = {
            body: ''
        };
        await makeBearerRequest(thingAPI, req.headers.accesstoken, data, next);
        //await makeBearerRequest(thingAPI, req.user.accessToken, data.body, next);
        res.send(data)
    });

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});


/**
 * A small helper function to make a GET request to the api.
 * It includes a bearer token in the request header.
 * @param url
 * @param authorization
 * @param response
 * @param next
 * @returns {Promise<>}
 */
const makeBearerRequest = (url, authorization, response, next) => fetch(url, {
  headers: {Authorization: 'bearer ' + authorization}
})
  .then((res) => {
      return res.ok ? res.json() : res.text()
  })
  .then((body) => {
      //console.log("response make bearer request: ");
      //console.log(body);
      response.body = body;
      // response.body = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
  })
  .catch(err => next(err));