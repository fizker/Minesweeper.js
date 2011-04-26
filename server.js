var HOST = null, // localhost
	PORT = 8080;

var sys = require('sys'),
	url = require('url'),
	server = require('./js/server.js'),
	io = require('socket.io'),
	socket = io.listen(server.server),
	handleChatRegister,
	handleChatMessage,
	handleChatLeave,
	handleChatChangeRoom;
server.debug = true;

function registerServices() {
	server.register('/', server.static('index.html'));
	server.register('/css/client.css', server.static('css/client.css', [
		'css/_.css', 'css/chat.css', 'css/layout.css'
	]));
	server.register('/js/client.js', server.static('js/client.js', [
		'js/chat.js', 'js/lobby.js', 'js/_.js'
	]));
	
	/*
	server.register('/chat/register/', handleChatRegister);
	server.register('/chat/enterroom/', handleChatChangeRoom);
	server.register('/chat/say/', handleChatMessage);
	server.register('/chat/leave/', handleChatLeave);
	*/
};

var users = [];

function notifyUsers(msg, exclusion) {
	if(typeof(msg) !== 'string') {
		msg = JSON.stringify(msg);
	}
	users.forEach(function(client) {
		if(client == exclusion) {
			return;
		}
		client.send(msg);
	});
};

function timestamp() {
	return new Date().toISOString();
};

socket.on('connection', function(client) {
	users.push(client);
	client.on('message', function(data) {
		data = JSON.parse(data);
		if(data.type == 'connect') {
			client.minesweeper = {
				name: data.name
			};
			notifyUsers({
				sender: data.name,
				type: 'connect',
				timestamp: timestamp()
			}, client);
			return;
		}
		if(data.msg) {
			data = {
				type: 'message',
				msg: data.msg,
				sender: client.minesweeper.name,
				timestamp: timestamp()
			};
			notifyUsers(data, client);
		}
	});
	client.on('disconnect', function() {
		var msg = {
			sender: client.minesweeper.name,
			type: "disconnect",
			timestamp: timestamp()
		};
		users.splice(users.indexOf(client), 1);
		notifyUsers(msg);
	});
});

registerServices();

server.listen(PORT, HOST);
