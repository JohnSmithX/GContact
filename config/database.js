var Schema = require('jugglingdb').Schema;

//数据库链接
var env = process.env.NODE_ENV || 'development'
  , opts = require('./config').database[env]['db'];

module.exports = new Schema(opts['adapter'], opts['opts']);