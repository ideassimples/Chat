'use strict'
const socketio = require('socket.io')
const helper = require('../helper')
const bded = require('../bded')
module.exports=function(server){
	const io =socketio(server)
	const db = bded()
	io.on('connection',onConection)

	//-------------

	function onConection(socket){
		console.log(`cliente conectado ${socket.id}`);
		db.list(function(err,messages){
			if(err)return console.error(err)

				socket.emit('messages',messages)
		})
		socket.on('message',function(message){
			const converter = helper.convertVideo(message.frames)
			converter.on('log',console.log)
			converter.on('video',function(video){
				delete message.frames
				message.video=video
				db.save(message,function(err){})

				socket.broadcast.emit('message',message)
				socket.emit('messageack',message)
				
			})
		})
		socket.on('disconnect',function(){
		console.log(`cliente desconectado ${socket.id}`);
	})
	}

}