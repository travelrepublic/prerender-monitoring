var restify = require('restify'),
	ssh = require('ssh2').Client;

var PORT = 4000;

var server = restify.createServer({
	name: 'prerender-monitoring'
});

server
  .use(restify.fullResponse())
  .use(restify.bodyParser());

server
	.get('/', function translate (req, res, next) {
		
		var conn = new ssh();

		conn.on('ready', function () {
			conn.exec('date', function (err, stream) {
				stream
					.on('data', function (data) {
						res.send(200, data);
					})
					.on('close', function (code, signal) {
						conn.end();
					});
			});
		});

		conn.connect({
			host: '10.0.0.76',
			port: 22,
			username: 'ec2-user',
			privateKey: require('fs').readFileSync('/home/ubuntu/prerender.pem'),
		});
	});

server.listen(PORT, function () {
	console.log('sourcemaps-stacktrace-started on port %s', PORT);
});