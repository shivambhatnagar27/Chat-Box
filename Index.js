var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require("express");
var path = require('path');
var Array = require('node-array');
var redis = require('redis');
var client = redis.createClient();
var cookieParser = require('cookie-parser');
var connection=[]
app.use(cookieParser());
//Redis Connections
client.on('connect', function() {
	console.log('connected');
});

// load static file
app.use(express.static(path.join(__dirname, 'Public')));

//routes and sends to the views
app.get('/', function(req, res) {
	res.sendFile('Views/Index.html', {                                                    
		root : __dirname
	});	
});
//Setting Connection
io.on('connection', function(socket) {
	//got the user id form socket this is the unique id for each and every connection
	var id = socket.id;
	socket.on('chat message', function(data) {
		var str = '{ "name":" ' + data.name + ' " ,"id":"' + id
				+ '" , "message":"' + data.msg + '" , "time":"' + data.time + '"  }';
		var jsonObj = JSON.parse(str);
		//pushed the message typed by the user                                              
		client.rpush([ 'messages', JSON.stringify(jsonObj) ]);

		//Getting last pushed message from redis
		client.lrange('messages', -1, -1, function(err, reply) {
			io.emit('chat message', reply);
		});
	});
	//Getting all the messages from redis
	client.lrange('messages', 0, -1, function(err, Allreply) {

		io.emit('all messages', Allreply);
	});
});

//Node work on specified port
http.listen(3000, function() {
	console.log('bhut bdia');
});