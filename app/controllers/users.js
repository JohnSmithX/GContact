var User = require('../models/user');


exports.authCallBack = function (req, res, next) {
  res.redirect('/');
};

exports.signin = function (req, res) {
  var name;
  for (name in req) {
    res.write(name + '\n');
  }

  res.end('signin in');
};


exports.loginForm = function (req, res) {
  res.render('login');
};


exports.login = function (req, res) {

  var username = req.body.username;
  var password = req.body.password;
  var rememberMe = req.body.remember_me;

  if (!username || !password) {
    return res.render('login', {
      'errors': '用户名或密码不为空'
    });
  }

  var minute = 60000;
  var hour = minute * 60;
  var day = hour * 24;
  var tokenExpire = +new Date(Date.now() + minute * 20);
  var rememberExpire = +new Date(Date.now() + day * 7);


  User.authenticate(username, password, function (err, user) {
    if (err || !user) {
      return res.render('login', {
        'errors': '用户名或密码错误'
      });
    }

    //if remember me  the cookie expire will be 7 day.
    var expire = tokenExpire;
    if (rememberMe) {
      expire = rememberExpire;
    }


    user.createToken(expire, function (err, token) {
      if (err) {
        return res.render('login', {
          'error': err
        });
      }

      if (token) {
        res.cookie('token', token.token, { maxAge: tokenExpire });
      }
      if (rememberMe) {
        res.cookie('token', token.token, { maxAge: rememberExpire });
      }

      if (req.query && req.query.from) {
        return res.redirect(req.query.from);
      }

      res.redirect('/');
    });
  });
};

exports.logout = function (req, res) {
  res.clearCookie('token');
  res.redirect('/login');
};

exports.show = function (req, res) {
  User.all(function (err, users) {
    res.render('users/show', {
      'users': users
    });
  });
};

exports.create = function (req, res) {

};