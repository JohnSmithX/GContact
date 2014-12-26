var express = require('express')
  , router = express.Router()
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , multer = require('multer')
  , errorhandler = require('errorhandler')
  , cookieParser = require('cookie-parser')
  , methodsOverride = require('method-override');

var fs = require('fs');

module.exports = function (app, options) {

  //jade engine
  app.set('view engine', 'jade');
  app.engine('jade', require('jade').__express);
  app.set('views', global.RootPath + '/app/views');

  app.use(errorhandler());

  //log as a log
  //var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
  //app.use(morgan('dev', { stream: accessLogStream }));
  app.use(morgan('dev'));
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(multer());

  /*  <input type="hidden" name="_method" value="delete or put"/>
   *  get       -> select
   *  post      -> insert
   *  put       -> update
   *  delete    -> delete
   **/
  app.use(methodsOverride('_method'));

  //check if login
  var auth = require('./middlewares/authorization');
  app.use(auth.requireLogin());

  app.use(express.static(global.RootPath + '/public'));

  require('./router')(router);
  app.use('/', router);
};