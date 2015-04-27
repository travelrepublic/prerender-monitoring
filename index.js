var restify = require('restify');

var PORT = 4000;

var server = restify.createServer({
	name: 'prerender-monitoring'
});

server
  .use(restify.fullResponse())
  .use(restify.bodyParser());

server
	.get('/', function translate (req, res, next) {
		res.send(200, 'It works!');
	});

server.listen(PORT, function () {
	console.log('sourcemaps-stacktrace-started on port %s', PORT);
});