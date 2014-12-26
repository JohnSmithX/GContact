var schema = require('../../config/database')
  , Schema = require('jugglingdb').Schema;


var ChatRoom = module.exports = schema.define('ChatRoom', {

  name:       { type: String, length: 255, null: false },
  describe:   { type: String, length: 255 },
  creator:    { type: Number, null: false },
  created_at: { type: Date },
  updated_at: { type: Date },
  password:   { type: String, length: 255 }

}, {
  table: 'chat_rooms'
});
//relations
var User = require('./user')
  , Chat = require('./chat');

ChatRoom.hasMany(User, { as: 'members', foreignKey: 'chat_room_id' });

ChatRoom.belongsTo(User, { as: 'whoCreator', foreignKey: 'creator' });

ChatRoom.hasMany(Chat, { as: 'chatRecords', foreignKey: 'chat_room_id' });

//

var socket = require('../helpers/socketEvents');

ChatRoom.all(function (err, chatRooms) {
  if (chatRooms.length == 0 || err) {
    return;
  }
  chatRooms.forEach(function (chatRoom) {
    socket.createRoom('/chatrooms/' + chatRoom.id);
  });
});

ChatRoom.beforeCreate = function (next, data) {
  data.created_at = +new Date();
  data.updated_at = +new Date();
  next();
};


ChatRoom.afterCreate = function (next) {
  //没创建一个房间就需要创建一个socket namespace
  socket.createRoom('/chatrooms/' + this.id);
  next();
};

ChatRoom.afterDestroy = function (next) {
  //删除房间的同时需要删除socket namespace
  socket.dropNamespace('/chatrooms/' + this.id);
  next();
};
//before update we should reset  `updated_at` = Date.now()
ChatRoom.beforeUpdate = function (next, data) {
  data.updated_at = +new Date();
  next();
};


//validates
ChatRoom.validatesUniquenessOf('name', { message: '房间已存在' });
ChatRoom.validatesLengthOf('name', { max: 8, message: { max: '房间名称不能超过8个文字' } });
ChatRoom.validatesLengthOf('describe', { max: 12, message: { max: '房间描述不能超过12个文字' } });


//get online users list
//for socket chat room
ChatRoom.prototype.getOLList = function (cb) {
  this.members(function (err, members) {
    var numUsers;
    if (!err) {
      numUsers = members.length;
      cb(err, members, numUsers);
    } else {
      cb(err, {});
    }

  });
};

ChatRoom.getChatRoomList = function (cb) {
  ChatRoom.all(function (err, chatRooms) {
    if (chatRooms.length == 0) {
      return cb(err, []);
    }
    var chatRoomCount = 0;
    chatRooms.forEach(function (chatRoom) {

      chatRoom.whoCreator(function (err, owner) {

        chatRoom.members(function (err, users) {

          chatRoom.owner = owner;
          chatRoom.numOfMembers = users.length;
          chatRoomCount += 1;
          if (chatRoomCount == chatRooms.length) {
            cb(err, chatRooms);
          }

        });

      });
    });

  });
};

ChatRoom.prototype.removeUser = function (user, cb) {
  console.log(this instanceof ChatRoom);
  this.members.find(user.id, function (err, user) {
    user.updateAttribute('chat_room_id', 0, cb);
  });
  //    this.members.remove(user, cb);
};


