var express = require('express')
  , app = express();

require('./config/config');

var port = process.env.PORT || 80;

var socketIO = exports.socketIO = require('socket.io').listen(app.listen(port, function () {
  console.log("http://127.0.0.1:" + port + "/");
}));

require('./config/express')(app);
