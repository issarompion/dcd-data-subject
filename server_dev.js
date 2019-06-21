var express = require("express");
var path = require("path");
var dotenv = require("dotenv");
var findconfig = require("find-config");
var fetch = require("node-fetch");
var cors = require('cors')
// Faster server renders w/ Prod mode (dev mode never needed)
dotenv.config({ path: findconfig('.env') });
// Express server
var app = express();
const token = process.env.TOKEN
var PORT = process.env.PORT || 8080;
const backends = {
    api: process.env.API_URL,
    user:process.env.USER_URL
  };

app.use(cors())

app.get('/api/things', //checkAuthentication,
    async (req, res, next) => {
        console.log('api/things')
        const thingsAPI = backends.api + '/things';
        fetch(thingsAPI, {
          headers: {Authorization: 'bearer ' +token}
        })
          .then((res) => {
              return res.ok ? res.json() : res.text()
          })
          .then((body) => {
              res.send(body)
              // response.body = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
          })
          .catch(err => next(err));
    });

   app.get('/api/things/:thingId', //checkAuthentication,
    async (req, res, next) => {
        const thingId = req.params.thingId;
        console.log('api/things/'+thingId)
        const thingAPI = backends.api + '/things/' + thingId;
        fetch(thingAPI, {
          headers: {Authorization: 'bearer ' +token}
        })
          .then((res) => {
              return res.ok ? res.json() : res.text()
          })
          .then((body) => {
              res.send(body)
          })
          .catch(err => next(err));
    });


app.get('/api/user', //checkAuthentication,
    async (req, res, next) => {
        console.log('api/user')
        const userAPI = backends.user
        fetch(userAPI, {
            headers: {Authorization: 'bearer ' +token}
          })
            .then((res) => {
                return res.ok ? res.json() : res.text()
            })
            .then((body) => {
                res.send(body)
                // response.body = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
            })
            .catch(err => next(err));
    });

    app.get('/api/persons/:userId', //checkAuthentication,
    async (req, res, next) => {
        const userId = req.params.userId;
        console.log('api/user/'+userId)
        const userNameAPI = backends.api+'/persons/'+userId
        fetch(userNameAPI, {
            headers: {Authorization: 'bearer ' +token}
          })
            .then((res) => {
                return res.ok ? res.json() : res.text()
            })
            .then((body) => {
                res.send(body)
                // response.body = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
            })
            .catch(err => next(err));
    });

// Start up the Node server
app.listen(PORT, function () {
    console.log("Node Express server listening on http://localhost:" + PORT);
});
//# sourceMappingURL=server.js.map