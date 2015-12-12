const st = require('st');
const path = require('path');
const course = require('course');
//const jsonBody = require('body/json');
const router = course();
const helper = require('../helper');

const mount=st({
	path:path.join(__dirname,'..','public'),
	index:'index.html',
	passthrough:true
});


/*router.post('/process',function(req,res){
	jsonBody(req,res,{limit:3 * 1024 * 1024},function(err,body){
		if(err)return fail(err,res);

		if(Array.isArray(body.images)){
			const converter = helper.convertVideo(body.images)

			converter.on('log',function(msg){
				console.log(msg)
			})
		
			converter.on('video',function(video){
				res.setHeader('Content-type','application/json')
				res.end(JSON.stringify({video:video}))
			});
		}else{
			res.statusCode=500;
			res.end(JSON.stringify({error:'parametro `images` requerido'}))
		}
		
	});
});*/


function onRequest(req,res){
	if(req.url.startsWith('/socket.io'))return
	mount(req,res,function(err){
		if(err)return res.end(err.message);

		router(req,res,function(err){
			if(err)return fail(err,res);
			res.statusCode=404;
			res.end(`No encontrado ${req.url}`);
		});
		
	});
}

function fail(err,res){
	res.statusCode = 500;
	res.setHeader('Content-type','text/plain');
	res.end(err.message);
}

module.exports= onRequest;