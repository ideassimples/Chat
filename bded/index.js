'use strict'
const level = require('level')
const uuid = require('uuid')
const ttl = require('level-ttl')
const concat=require('concat-stream')
module.exports=function(options){
	
	options=options||{}
	let duration=options.duration || 10 * 60 * 1000
	let limit= options.limit || 10
	const db = ttl(level('./messages.db'),{checkFrequency:10000})



	function save(message,callback){
		var key=`message-${Date.now()}-${uuid.v4()}`
		let options={
			valueEncoding:'json',
			ttl:duration
		}
		db.put(key,message,options,callback)
	}

	function list(callback){
		let res = db.createValueStream({
			limit:limit,
			valueEncoding:'json',
			reverse:true,
			gt:'message'

		})

		res.pipe(concat(function(messages){
			callback(null,messages.reverse())
		}))

		res.on('error',callback)
	}

	return{
		save:save,
		list:list
	}

}