var schema = require('../../config/database')
  , Schema = require('jugglingdb').Schema;


var Session = module.exports = schema.define('Session', {
  user_id:    { type: Number, null: false },
  token:      { type: String, null: false },
  expire:     { type: Date },
  created_at: { type: Date }
}, {
  table: 'sessions'
});

//relation
var User = require('./user');
Session.belongsTo(User, { as: 'owner', foreignKey: 'user_id' });
//
Session.beforeSave = function (next, data) {
  //if expire isn't set then set it 7 days ago
  if (!data.expire) {
    data.expire = Date.now() + global.DAY * 24;
  }
  data.created_at = Date.now();
  next();
  //    data.isJustOne(data.user_id, function(){
  //        if (data.expire) {
  //            data.expire = new Date(Date.now() + 3600000 * 7 * 24);
  //        }
  //        data.created_at = new Date(Date.now());
  //        next();
  //    });
};
//Session.prototype.isJustOne = function(user_id, cb) {
//    Session.all({where: {user_id: user_id}}, function(err, sessions){
//        if (sessions.length >= 1) {
//            for (var session in sessions) {
//                sessions[session].destroy();
//            }
//        }
//        cb();
//    });
//}
