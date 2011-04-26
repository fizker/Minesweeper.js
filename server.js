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
	var data = '', user = url.parse(request.url, true);
	users.push({ name: user.query.user, response: response, sse: new server.sse(response, 'welcome') });
	
	setTimeout(function() {
		console.log('Sending to user');
		users.forEach(function(user) {
			user.sse.send('{"sender": "Server", "msg": "Very important message!", "timestamp": "'+(new Date().toISOString())+'"}');
		});
		setTimeout(function() {
			console.log('Sending to user');
			users.forEach(function(user) {
				user.sse.send('{"sender": "Server", "msg": "Very important message!", "timestamp": "'+(new Date().toISOString())+'"}');
			});
		}, 4000);
	}, 1000);
};
handleChatMessage = function handleChatMessage(request, response) {};
handleChatChangeRoom = function handleChatChangeRoom(request, response) {};
handleChatLeave = function handleChatLeave(request, response) {};

registerServices();

server.listen(PORT, HOST);
