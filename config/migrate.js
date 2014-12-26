/**
 * Created by xus on 14-11-7.
 */

var schema = require('./database');

//var Chat = require('../app/models/chat'),
//    ChatRoom = require('../app/models/chatRoom'),
//    Organization = require('../app/models/organization'),
//    Session = require('../app/models/session'),
//    Telephone = require('../app/models/telephone'),
var User = require('../app/models/user');


//schema.automigrate();

var u = new User({
  work_id:            '123707',
  encrypted_password: '1234',
  true_name:          '石方',
  email:              'sf@gmail.com'
});

u.save();
//u.isValid(function (valid) {
//    console.log(u.errors);
//    for (value in global._.pairs(u.errors)) {
//        console.log(global._.pairs(u.errors)[value]);
//    };
//
//
//
//});
//User.create({
//    work_id: '125238',
//    encrypted_password: '1234',
//    true_name: '徐帅',
//    email: 'dyxushuai@gmail.com'
//}, function (err, user) {
//    console.log(err);
//    console.log(user);
//
//});