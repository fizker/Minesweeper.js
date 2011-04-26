var HOST = null, // localhost
	PORT = 8080;

var sys = require('sys'),
	server = require('./framework/server.js'),
	handleChatRegister,
	handleChatMessage,
	handleChatLeave,
	handleChatChangeRoom;
server.debug = true;

function registerServices() {
	server.register('/', server.static('index.html'));
	server.register('/css/_.css', server.static('css/_.css'));
	server.register('/js/_.js', server.static('js/_.js'));
	server.register('/js/chat.js', server.static('js/chat.js'));
	server.register('/js/es5.js', server.static('js/es5.js'));
	
	server.register('/chat/register/', handleChatRegister);
	server.register('/chat/enterroom/', handleChatChangeRoom);
	server.register('/chat/say/', handleChatMessage);
	server.register('/chat/leave/', handleChatLeave);
};

handleChatRegister = function handleChatRegister(request, response) {};
handleChatMessage = function handleChatMessage(request, response) {};
handleChatChangeRoom = function handleChatChangeRoom(request, response) {};
handleChatLeave = function handleChatLeave(request, response) {};

registerServices();

server.listen(PORT, HOST);
