var HOST = null, // localhost
	PORT = 8080;

var sys = require('sys'),
	server = require('../framework/server.js');
server.debug = true;

server.register('/', server.static('index.html'));
server.register('/css/_.css', server.static('../css/_.css'));
server.register('/js/_.js', server.static('../js/_.js'));
server.register('/js/chat.js', server.static('../js/chat.js'));
server.register('/js/es5.js', server.static('../js/es5.js'));



server.listen(PORT, HOST);