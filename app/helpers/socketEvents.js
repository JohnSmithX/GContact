//封装公用事件

var socketIO = require('../../server').socketIO;

exports.events = [
  'new message',
  'join',
  'disconnect'
];

var users = {};
var User = require('../models/user');

/**
 *
 * @type {Function}
 */
var createRoom = exports.createRoom = function (nsp) {

  //单个namespace闭包变量
  users[nsp] = users[nsp] || [];


  socketIO.of(nsp).on('connection', function (socket) {
    //单个socket闭包变量
    var currentUser;
    var chatRoomID = Number(nsp.split('/')[2]);
    //广播信息
    socket.on('new message', function (data) {
      //记录信息

      socket.broadcast.emit('new message', {
        userID:   currentUser.id,
        username: currentUser.true_name,
        message:  data
      });
    });

    //新用户加入时,刷新列表
    socket.on('join', function (token) {
      //console.log(data);
      User.getUserByToken(token, function (err, user) {
        if (!err && user) {
          currentUser = user;
          user.updateAttribute('chat_room_id', chatRoomID);
          users[nsp].push(user.true_name);
          socket.emit('login', user.true_name);
          socket.emit('user list', users[nsp]);
          socket.broadcast.emit('user list', users[nsp]);
        }
      });

    });

    socket.on('disconnect', function () {
      //断开连接时从用户列表中删除
      if (currentUser) {
        currentUser.updateAttribute('chat_room_id', 0);
        global._.remove(users[nsp], function (name) {
          return name == currentUser.true_name;
        });
        socket.emit('user list', users[nsp]);
        socket.broadcast.emit('user list', users[nsp]);
      }
    });
  });
};


var dropNamespace = exports.dropNamespace = function (nsp) {
  delete users[nsp];
  delete socketIO.nsps[nsp];
};