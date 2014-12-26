var Chat = require('../models/chat')
  , ChatRoom = require('../models/chat_room');


exports.roomCreator = function (req, res) {
  ChatRoom.find(req.params.chat_room_id, function (err, chatRoom) {
    if (!err) {
      chatRoom.getOLList(function (err, members, numUsers) {
        res.send(members);
      });
    }
  });
};

//get -> /chatrooms/new
exports.new = function (req, res) {
  req.currentUser.chatRooms(function (err, chatRooms) {
    if (chatRooms.length >= 1) {
      ChatRoom.getChatRoomList(function (err, chatRooms) {
        if (err) {
          console.log(err);
        }
        return res.render('chatrooms/list', {
          'user':      req.currentUser,
          'chatRooms': chatRooms,
          'errors':    [['name', '您只能创建一个房间']]
        });
      });
    } else {
      res.render('chatrooms/new', {
        'user': req.currentUser
      });
    }
  });
};

//url -> /chatrooms/:chat_room_id
exports.show = function (req, res) {
  var url = '/chatrooms/' + req.params.chat_room_id;

  res.render('chatrooms/chatroom', {
    'user': req.currentUser,
    'url':  url
  });
};

//url -> /chatrooms/list
exports.all = function (req, res) {
  ChatRoom.getChatRoomList(function (err, chatRooms) {
    if (err) {
      console.log(err);
    }
    res.render('chatrooms/list', {
      'user':      req.currentUser,
      'chatRooms': chatRooms
    });
  });
};

exports.create = function (req, res) {
  if (!req.body.name) {
    return res.render('chatrooms/new', {
      'user': req.currentUser
    });
  }
  var chatRoomName = req.body.name;
  var describe = req.body.describe || '聊天室';
  var password = req.body.crpassword;

  var chatRoom = new ChatRoom({
    name:     chatRoomName,
    creator:  req.currentUser.id,
    describe: describe,
    password: password
  });

  chatRoom.isValid(function (isValid) {
    if (isValid) {
      chatRoom.save(function (err, chatRoom) {
        if (err) {
          throw new Error(err);
        }
        req.currentUser.updateAttribute('chat_room_id', chatRoom.id, function (err, user) {
          console.log('/app/controllers/chatRooms/86 ' + err);
        });
        return res.redirect('/chatrooms/' + chatRoom.id);
      });
    } else {
      return res.render('chatrooms/new', {
        'user':   req.currentUser,
        'errors': global._.pairs(chatRoom.errors)
      });
    }

  });
};

//url -> /chatrooms/:chat_room_id/delete
exports.delete = function (req, res) {
  req.currentUser.chatRooms(function (err, chatRooms) {
    if (chatRooms.length >= 1) {
      chatRooms.forEach(function (chatRoom) {
        if (chatRoom.id == req.params.chat_room_id) {
          ChatRoom.find(req.params.chat_room_id, function (err, chatRoom) {
            if (err || chatRoom == null) {
              return res.redirect('/chatrooms');
            }
            chatRoom.destroy(function (err) {
              if (err) {
                throw new Error(err);
              }
              return res.redirect('/chatrooms');
            });
          });
        }
      });
    } else {
      res.redirect('/chatrooms');
    }
  });
};

//socket
exports.socketio = function (req, res) {

};

