'use strict'
const fs =require('fs');

module.exports=function(folder,filter,callback){

	fs.readdir(folder,onReaddir)

	function onReaddir(err,res){
		if(err)return callback(err);
		let files = res.filter(filterFiles);
		callback(null,files);
	}

	function filterFiles(File){
		return File.startsWith(filter);
	}
}