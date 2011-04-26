(function(exports) {
	"use strict";
	var notFound,
		createServer = require('http').createServer,
		readFile = require('fs').readFile,
		sys = require('sys'),
		url = require('url'),
		handlers = {},
		mimeTypes = require('./mimeTypes.js');
	
	function simpleText(body, code) {
		code = code || 200;
		this.writeHead(code, {
			'Content-Type': 'text/plain; charset="utf-8"',
			'Content-Length': body.length
		});
		this.end(body);
	};
	function simpleJSON(body, code) {
		code = code || 200;
		this.writeHead(code, {
			'Content-Type': 'application/json; charset="utf-8"',
			'Content-Length': body.length
		});
		this.end(body);
	};
	notFound = (function(msg) {
		return function notFound(req, res) {
			res.writeHead(404, { 
				"Content-Type": 'text/plain; charset="utf-8"', 
				"Content-Length": msg.length
			});
			res.end(msg);
		};
	} ("Not Found\n"));
	
	var server = createServer(function server(request, response) {
		var path = url.parse(request.url).pathname,
			handler = handlers[path] || notFound;
		response.simpleText = simpleText;
		response.simpleJSON = simpleJSON;
		
		switch(request.method) {
			case 'GET':
			case 'HEAD':
			case 'POST':
				break;
		}
		
		handler(request, response);
	});
	
	function open(port, host) {
		server.listen(port, host);
		sys.puts('Server at http://'+(host || 'localhost')+':'+port.toString()+'/');
	};
	
	function close() {
		server.close();
	};
	
	function addHandler(path, handler) {
		handlers[path] = handler;
	};
	
	function staticHandler(preferredFile, fallbackFiles) {
		var headers = { 'Content-type': mimeTypes.parse(preferredFile), 'Content-length': 0 }, 
			body = [], contentType, files,
			debug = this.debug;
		
		function loadResponseData(callback) {
			if(body && headers && !debug) {
				callback();
				return;
			}
			if(fallbackFiles) {
				files = fallbackFiles.concat().reverse();
			}
			body = [];
			function allDone() {
				body = body.join("\n");
				headers['Content-length'] = body.length;
				if(!debug) {
					headers['Cache-Control'] = 'public';
				}
				callback();
			}
			
			function readFileCallback(err, data) {
				if(err) {
					this.error(err);
					return;
				}
				this.success(data);
			};
			readFile(preferredFile, readFileCallback.bind({
				error: function() {
					var rfc;
					
					if(!fallbackFiles) {
						sys.puts('Error when loading file <'+filePath+'>: '+err);
						return;
					}
					
					rfc = readFileCallback.bind({
						error: function(err) {
							sys.puts('Error when loading file <'+filePath+'>: '+err);
							fallbackLoader();
						},
						success: function(data) {
							body.push(data);
							fallbackLoader();
						}
					});
					function fallbackLoader() {
						var file = files.pop();
						if(file) {
							readFile(file, rfc);
						} else {
							allDone();
						}
					};
					fallbackLoader();
				},
				success: function(data) {
					body.push(data);
					allDone();
				}
			}));
		};
		
		return function staticHandler(request, response) {
			loadResponseData(function staticCallback() {
				response.writeHead(200, headers);
				response.end(request.method === 'HEAD' ? '' : body);
			});
		};
	};
	
	exports.listen = open;
	exports.close = close;
	exports.register = addHandler;
	exports.static = staticHandler;
}(exports));
