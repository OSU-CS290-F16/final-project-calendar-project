var path = require('path');

var staticDir = path.join(__dirname, 'public');
var index = 'index.html';
var notFound = '404.html';
var style = 'style.css';
var js = 'js/view_calendar.js';//not sure about pathing here
var port = process.env.PORT || 3000;

var http = require("http");
var url = require("url");
var fs = require("fs");

var cache = {};
console.log("staticDir:", staticDir);
cache[index] = fs.readFileSync(path.join(staticDir, '/index.html'));
cache[notFound] = fs.readFileSync(path.join(staticDir, '/404.html'));
cache[style] = fs.readFileSync(path.join(staticDir, '/style.css'));
cache[js] = fs.readFileSync(path.join(staticDir, '/js/view_calendar.js'));//more sure about pathing here

var server = http.createServer(function(req, res){

	var url = req.url;
	url = req.url.substr(1);
	console.log("== url:", url);

	if(url==index || url==style || url==notFound || url=='')
	{
			res.statusCode = 200;
			console.log("== Status Code:", res.statusCode);
			if(url==index || url=='')
			{
				res.write(cache[index]);
			}
			if(url==style)
			{
				res.write(cache[style]);
			}
			if(url==notFound)
			{
				res.write(cache[notFound]);
			}
			if(url==js)
			{
				res.write(cache[js]);
			}
			res.end();
	}
	else
	{
			res.statusCode = 404;
			console.log("== Status Code: 404 (File not found)");
			res.write(cache['404.html']);
			res.end();
	}
});
server.listen(port, function() {
  console.log("== Server listening on port:", port);
});
