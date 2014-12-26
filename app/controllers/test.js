var Session = require('../models/session');
var hat = require('hat');
exports.test = function (req, res) {
  Session.create({ user_id: 2, token: hat(), expire: new Date(Date.now()) }, function (err, session) {
    res.send(session);
  });
};
