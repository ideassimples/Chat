'use strict'
const spawn = require('child_process').spawn
const os = require('os')
const path = require('path');

module.exports=function(options,callback){
	if(!options.baseName)return callback(new TypeError('Debes Especificar el nombre de las imagenes'))
	let folder = options.folder || os.tmpDir()
	let baseName = options.baseName
	let fileSrc = path.join(folder,`${baseName}-%d.jpg`)
	console.log(`${baseName}-%d.jpg`)
	let fileDest = path.join(folder,`${baseName}.webm`)
	console.log(`${baseName}.webm`)
	//ffmpeg -i images-%d.jpg -filter:v "setpts=2.5*PTS" -vcodec libvpx -an video.webm
	let ffmpeg = spawn('ffmpeg',[
		'-i',
		fileSrc,
		'-filter:v',
		'setpts=2.5*PTS',
		'-vcodec',
		'libvpx',
		'-an',
		fileDest
	])
	ffmpeg.stdout.on('close',function(code){
		if(!code)return callback(null);
		callback(new Error(`ffmpeg  termino con el codigo ${code}`))
	})
}