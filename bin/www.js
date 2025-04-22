const app = require('../app');
const http = require('http');
const port = normalizePort(process.env.PORT || '9000')
const ExpressPeerServer = require('peer').ExpressPeerServer;
const options = {
  debug: true,
  path: "/omeetly",
}

//Vytvoření HTTP serveru
const server = http.createServer(app);

//Vytvoření Peer serveru
app.set('port', port);
app.use('/peerjs', ExpressPeerServer(server, options));

//Zapnutí serveru
server.listen(port);

//Funkce pro ošetření Portu
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

//Funkce pro vypnutí serveru
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});