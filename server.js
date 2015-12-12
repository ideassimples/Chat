'use strict'

const http = require('http');
const port = process.env.PORT || 8080;
const server = http.createServer();
const router =require('./router');
const realTime = require('./realtime')

realTime(server);
server.on('request',router);
server.on('listening',onListening);
server.listen(port);

function onListening(){
	console.log(`Escuchando el puerto ${port}`);
} 