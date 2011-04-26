var HOST = null, // localhost
	PORT = 8080;

var sys = require('sys'),
	url = require('url'),
	server = require('./js/server.js'),
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
	
	server.register('/chat/register/', handleChatRegister);
	server.register('/chat/enterroom/', handleChatChangeRoom);
	server.register('/chat/say/', handleChatMessage);
	server.register('/chat/leave/', handleChatLeave);
};

var users = [];
var chatId = 1;
handleChatRegister = function handleChatRegister(request, response) {
	var key = 'abc', user = url.parse(request.url, true);
	console.log('registering user: ', user.query.user);
	users.push({
		name: user.query.user,
		response: response,
		sse: new server.sse(response, JSON.stringify({
			id: users.length,
			password: key
		})),
		password: key
	});
};
handleChatMessage = function handleChatMessage(request, response) {
	console.log('message received');
	var data = '';
	request.addListener('data', function(d) {
		data += d;
	});
	request.addListener('end', function() {
		data = JSON.parse(data);
		console.log(data);
		var msg = {
			msg: data.msg,
			sender: data.sender,
			timestamp: new Date().toISOString()
		};
		users.forEach(function(user, id) {
			if(data.id == id) {
				return;
			}
			console.log('sending to ', user.name, user.sse);
			user.sse.send(JSON.stringify(msg));
		});
		response.end();
	});
};
handleChatChangeRoom = function handleChatChangeRoom(request, response) {};
handleChatLeave = function handleChatLeave(request, response) {};

registerServices();

server.listen(PORT, HOST);
