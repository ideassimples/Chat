'use strict'

const http = require('http');
const port = process.env.PORT || 8080;
const server = http.createServer();
const fs = require('fs'); // manejo de archivos
const path = require('path'); // manejo de rutas para adaptar a todos los sistemas operativos 
//const st =require('st'); // manejo de archivos estaticos npm install st --save


server.on('request',onRequest);
server.on('listening',onListening);
server.listen(port);

/* funciones callback
const server = http.createServer(function(req,res){
	res.end('Hola Mundo');
});

server.listen(port,function(){
	console.log('escuchando el puerto '+port);
}); 
*/

/* Funciones 
const server = http.createServer(onRequest);
server.listen(port,onListening);*/

function serverIndex(res){
	let nombre=path.join(__dirname,'public','index.html');
	let rs = fs.createReadStream(nombre);
	res.setHeader('Content-type','text/html');
	rs.pipe(res);

	res.on('error',function(err){
		res.end(err.message);
	});

}

function serverApp(res){
	let nombre = path.join(__dirname,'public','app.js');
	let rs = fs.createReadStream(nombre);
	res.setHeader('Content-type','text/javascript');
	rs.pipe(res);

	res.on('error',function(err){
		res.end(err.message);
	});
}
function onRequest(req,res){

	let uri = req.url;
	if(uri.startsWith('/index') || uri==='/'){
		return serverIndex(res);
	}
	if(uri==='/app.js'){
		return serverApp(res);
	}

	res.statusCode=404;
	res.end(`404 Archivo no encontrado ${uri}`);

	/* funcion sincrona sin callback
	let file = fs.readFileSync('public/index.html');
	res.end(file);*/

	/*funcion asincrona con callback, por defecto en node el primer parametro es para error 
	let nombre = path.join(__dirname,'public','index.html');
	let rs = fs.createReadStream(nombre);
	res.setHeader('Content-type','text/html');
	rs.pipe(res);
	

	res.on('error',function(err){
		res.end(err.message);
	});*/

	//__dirname:directorio actual en donde estamos ejecutando

	/* con rs.pipe(res) encadenamos todo este bloque de respuesta

	fs.readFile(nombre,function(err,file){
		if(err)return res.end(err.message);
		res.end(file);	
	});*/
}

function onListening(){
	//console.log('escuchando el puerto '+port);
	//usando template de string 
	console.log(`Escuchando el puerto ${port}`);
} 