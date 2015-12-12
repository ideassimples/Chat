'use strict'

const EventEmitter = require('events').EventEmitter;
const async=require('async');
const dataUriToBuffer = require('data-uri-to-buffer');
const uuid = require('uuid');
const os = require('os');
const fs= require('fs');
const path= require('path');
const lista = require('./lista');
const ffmpeg = require('./ffmpeg');
const concat = require('concat-stream')

module.exports=function(images){
	let events = new EventEmitter();
	let count =0;
	let baseName= uuid.v4();
	let tmpDir = os.tmpDir();
	let video 

	async.series([
		decodificarImagenes,
		crearVideo,
		codificarVideo,
		limpieza],
		conversionFinal);

	function decodificarImagenes(done){
		async.eachSeries(images,decodificarImagen,done)
	}

	function decodificarImagen(image,done){
		let nombre = `${baseName}-${count++}.jpg`;
		let buffer = dataUriToBuffer(image);
		let ws = fs.createWriteStream(path.join(tmpDir,nombre));

		ws.on('error',done).end(buffer,done);

		events.emit('log',`Convirtiendo ${nombre}`);
	}

	function crearVideo(done){
		ffmpeg({
			baseName:baseName,
			folder:tmpDir
		},done)
	}

	function codificarVideo(done){
		let nombre= `${baseName}.webm`
		let rs = fs.createReadStream(path.join(tmpDir,nombre))

		rs.pipe(concat(function (videoBuffer){
			video = `data:video/webm;base64,${videoBuffer.toString('base64')}`
			done()
		}))

		rs.on('error',done)
	}

	function limpieza(done){
		events.emit('log','limpieza');
		lista(tmpDir,baseName,function(err,files){
			if(err)return done(err);
			borrarArchivos(files,done)
		});
	}

	function borrarArchivos(files,done){
		async.each(files,borrarArchivo,done)
	}

	function borrarArchivo(file, done){
		events.emit('log',`Borrando ${file}`);
		fs.unlink(path.join(tmpDir,file),function(err){
			//ignorando error
			done()
		});
	}

	function conversionFinal(err){
		if(err)return events.emit('error',err);
		events.emit('video',video)
	}

	return events;
}
