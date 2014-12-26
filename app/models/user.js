var schema = require('../../config/database')
  , Schema = require('jugglingdb').Schema;

var crypto = require('crypto');


var User = module.exports = schema.define('User', {
  work_id:                { type: String, length: 255 },
  encrypted_password:     { type: String, length: 255, null: false },
  true_name:              { type: String, length: 255, null: false },
  mal_name:               { type: String, length: 255 },
  email:                  { type: String, length: 255 },
  avatar_file_name:       { type: String, length: 255 },
  avatar_updated_at:      { type: Date },
  avatar_file_size:       { type: Number },
  sex:                    { type: String, limit: 45 },
  reset_password_token:   { type: String, length: 255 },
  reset_password_sent_at: { type: Date },
  rest_organization_at:   { type: Date },
  sign_in_count:          { type: Number, default: 0 },
  current_sign_in_at:     { type: Date },
  last_sign_in_at:        { type: Date },
  current_sign_in_ip:     { type: String, length: 255 },
  last_sign_in_ip:        { type: String, length: 255 },
  created_at:             { type: Date, null: false },
  updated_at:             { type: Date, null: false },
  weibo_id:               { type: String },
  weixin_id:              { type: String, length: 255 },
  QQ:                     { type: String, length: 255 },
  bio:                    { type: Schema.Text },
  followers_count:        { type: Number, default: 0 },
  following_count:        { type: Number, default: 0 },
  chat_room_id:           { type: Number },
  salt:                   { type: String, default: '73372028' },
  is_login:               { type: Boolean }
}, {
  restPath: '/users',
  table:    'users'
});

//relation with other model
var Telephone = require('./telephone')
  , Session = require('./session')
  , Chat = require('./chat')
  , ChatRoom = require('./chat_room')
  , Organization = require('./organization');

User.hasMany(Telephone, { as: 'telephones', foreignKey: 'user_id' });

User.hasMany(Session, { as: 'loginToken', foreignKey: 'user_id' });

User.hasMany(Chat, { as: 'chatRecords', foreignKey: 'user_id' });

User.belongsTo(ChatRoom, { as: 'whichRoom', foreignKey: 'chat_room_id' });

User.hasMany(ChatRoom, { as: 'chatRooms', foreignKey: 'creator' });

User.hasAndBelongsToMany('organizations');


//validates values
User.validatesPresenceOf('work_id', { message: '员工编号不能为空' });
User.validatesPresenceOf('true_name', { message: '需要真实姓名' });
User.validatesUniquenessOf('work_id', { message: '员工编号已存在' });
User.validatesUniquenessOf('email', { message: '邮箱已注册' });


//before create we should set `created_at` and `updated_at`
User.beforeCreate = function (next, data) {
  data.created_at = Date.now();
  data.updated_at = Date.now();
  next();
};
//before update we should reset  `updated_at` = Date.now()
User.beforeUpdate = function (next, data) {
  data.updated_at = Date.now();
  next();
};


User.prototype.validPassword = function (password) {
  if (!password) {
    return false;
  }
  if (this.encrypted_password === User.encryptPassword(password)) {
    return true;
  }
};

User.prototype.createToken = function (expire, cb) {
  var hat = require('hat');
  expire = expire || global.DAY * 7;
  expire = Date.now() + expire;

  this.loginToken.create({ token: hat(), expire: expire }, function (err, session) {
    cb(err, session);
  });
};

// encrypt the password
User.encryptPassword = function (password) {
  //md5 encrypt
  if (!password) {
    return '';
  }
  return password;
};

User.getUserByWorkID = function (workID, cb) {
  User.all({ where: { work_id: workID }, order: 'id ASC' }, function (err, user) {
    if (err || user.length == 0) {
      return cb(err, null);
    }
    cb(err, user[0]);
  });
};

User.getUserByToken = function (token, cb) {
  Session.all({ where: { token: token }, order: 'id DESC' }, function (err, session) {
    if (err || session.length == 0) {
      return cb(err, null);
    }

    var overdue = Date.now() - session[0].expire;

    if (overdue >= 0 && overdue <= global.MINUTE * 10) {
      session[0].updateAttribute('expire', Date.now() + global.MINUTE * 20);
    } else if (overdue > global.MINUTE * 10) {
      return cb(err, null);
    }
    session[0].owner(function (err, user) {
      if (err || !user) {
        return cb(err, null);
      }
      cb(err, user);
    });
  });
};

User.authenticateByToken = function (token, cb) {
  User.getUserByToken(token, function (err, user) {
    if (err || !user) {
      return cb(err, null);
    }
    cb(err, user);
  });
};

User.authenticate = function (username, password, cb) {
  User.getUserByWorkID(username, function (err, user) {
    if (err || !user) {
      return cb(err, null);
    }
    if (!user.validPassword(password)) {
      return cb(err, null);
    }
    cb(err, user);
  });
};






