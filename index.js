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
		
		var conn = new ssh(),
			all = [],
			fin = '';

		conn.on('ready', function () {
			conn.exec('test.sh', function (err, stream) {
				if (err) {
					return res.send(500, err);
				}
				stream
					.on('data', function (data) {
						fin += data;
					})
					.on('close', function (code, signal) {
						res.send(200, { data: fin, code: code, signal: signal });
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