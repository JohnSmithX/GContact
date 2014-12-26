var valid = require('./middlewares/valid');


module.exports = function (router) {
  //test url
  var test = require('../app/controllers/test');
  router.get('/test', test.test);

  var index = require('../app/controllers/index');
  router.get('/', index.index);

  //用户相关
  var users = require('../app/controllers/users');
  router.get('/signin', users.signin);
  router.route('/users')
    .get(users.show)
    .post(users.create);
  router.route('/login')
    .get(users.loginForm)
    .post(users.login);
  router.route('/logout')
    .get(users.logout);

  //聊天室相关
  var chatRooms = require('../app/controllers/chat_rooms');
  router.route('/chatrooms')
    .get(chat_rooms.all)
    .post(chat_rooms.create);

  router.get('/chatrooms/new', chat_rooms.new);
  router.get('/chatrooms/:chat_room_id', valid.validNumber('chat_room_id'), chat_rooms.show);
  router.get('/chatrooms/:chat_room_id/delete', valid.validNumber('chat_room_id'), chat_rooms.delete);

  router.get('/chatrooms/:chat_room_id/members', valid.validNumber('chat_room_id'), chat_rooms.roomCreator);
};
