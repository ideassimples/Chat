const webrtc2images = require('webrtc2images');
//const xhr = require('xhr');
const messageTpl = require('./templates/message.hbs')
const domify = require('domify')
const io = require('socket.io-client')
const socket = io.connect();
const uuid=require('uuid')

const id = uuid.v4(); 

const rtc = new webrtc2images({
width:200,
height:200,
frames: 10,
type:'image/jpeg',
quality:0.4,
interval:200
});


rtc.startVideo(function (err){
	if(err)return logError(err);
});

const messages = document.querySelector('#messages')
const form = document.querySelector('form')

form.addEventListener('submit',function(e){
	e.preventDefault();
	grabar();
},false)



socket.on('message',agregarMensage)

socket.on('messageack',function(message){
	if(message.id===id){
		agregarMensage(message)
	}
})

socket.on('messages',function(messages){
	messages.forEach(agregarMensage)
})

function grabar(){
	const input=document.querySelector('input[name="message"]')
	const message=input.value;
	input.value='';
	rtc.recordVideo(function(err,frames){
		if(err)return logError(err);
		socket.emit('message',{id:id,message:message,frames:frames})

	/*xhr({
		uri:'/process',
		method:'post',
		headers:{'Content-Type':'application/json'},
		body: JSON.stringify({images:frames}),
	},function(err,res,body){
		if(err)return logError(err);
		body = JSON.parse(body);

		if(body.video){
				/*const video = document.querySelector('#video')
				video.src=body.video
				video.loop=true
				video.play()*/
			/*agregarMensage({message:message,video:body.video});
		}
		});*/

	});
}

function agregarMensage(message){
	const m = messageTpl(message)
	messages.appendChild(domify(m));
	window.scrollTo(0,document.body.scollHeight);
}

function logError(err){
	console.error(err);
}