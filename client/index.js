#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var http = require('http');
require('dotenv').config()

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
// TODO: GET RID OF THIS LINE, FIX CERTIFICATE ISSUE!
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on http://localhost:' + addr.port);
}

/**
 * Websocket connection
 * Send the Websocket id of every connection to user
 */

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws, req) => {
  var wid = req.headers['sec-websocket-key'];
  const json = {
    wid : wid
  }
  ws.send(JSON.stringify(json));
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.on('close', function close() {
    console.log('close');
  });
  
});