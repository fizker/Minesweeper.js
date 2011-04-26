var mimeTypes = {
	"css": "text/css",
	"js": "application/javascript",
	"html": "text/html",
	"json": "application/json",
	"png": "image/png",
	"svg": "image/svg+xml"
};

exports.parse = function parse(filename) {
	var ext = filename.substring(filename.lastIndexOf('.')+1).toLowerCase();
	return mimeTypes[ext] || 'application/octet-stream';
};