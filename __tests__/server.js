function makeServer(done = () => {}) {
  var express = require('express');
  var path = require('path');
  var app = express();

  app.get('/', function (req, res) {
  	res.status(200).sendFile(`__tests__/e2e/test.html`, {root: path.resolve()});
  });
  app.get('/simmer.js', function (req, res) {
  	res.status(200).sendFile(`dist/simmer.js`, {root: path.resolve()});
  });
  var server = app.listen(3993, function () {
  	var port = server.address().port;
  	done()
  });
  return server;
}
module.exports = makeServer;
