exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};

var User = require('../../app/models/user');
var needNotValidUrl = ['fonts', 'images', 'libs', 'scripts', 'styles'];

exports.requireLogin = function () {
  return function (req, res, next) {

    if (needNotValidUrl.indexOf(req.url.split('/')[1]) >= 0) {
      return next();
    }
    if (req.url.replace(/\/$/, '').indexOf('/login') == 0) {
      return next();
    }
    if (req.url.replace(/\/$/, '').indexOf('/logout') == 0) {
      return next();
    }
    //if (req.url.replace(/\/$/, '').indexOf('/chatrooms') == 0 ) { return next(); }

    if (!(req.cookies && req.cookies.token)) {
      return res.redirect('/login?from=' + req.url);
    }

    User.authenticateByToken(req.cookies.token, function (err, user) {
      if (err || !user) {
        return res.redirect('/login?from=' + req.url);
      }
      req.currentUser = user;
      next();
    });
  };
};