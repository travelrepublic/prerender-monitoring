var restify = require('restify'),
	control = require('control');

var PORT = 4000;

var server = restify.createServer({
	name: 'prerender-monitoring'
});

server
  .use(restify.fullResponse())
  .use(restify.bodyParser());

server
	.get('/', function translate (req, res, next) {
		var shared = Object.create(control.controller),
			results = [];

		shared.user = 'control';
		shared.logPath = '/home/ubuntu/test.log';

		var controllers = control.controllers([
			'10.0.0.251',
			'10.0.0.77',
			'10.0.0.111',
			'10.0.0.76'
		], shared);

		for (var i = 0, ii = controllers.length; i < ii; i++) {
			controllers[i].ssh('date', function () {
				results.push(arguments);
			})
		};

		setTimeout(function () {
			res.send(200, results);
		}, 5000)
	});

server.listen(PORT, function () {
	console.log('sourcemaps-stacktrace-started on port %s', PORT);
});