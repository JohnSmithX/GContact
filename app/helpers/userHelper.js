/*loginErr is for login unusual
 * isLogin: if someone has log in, it will be true
 * rightPassword: if password is right, it will be set to true
 * hasUser: if the user existed, it will be set to true
 *
 *
 *
 * eg. {
 *   isLogin: false,
 *   rightPassword: false,
 *   hasUser: true
 * }*/
exports.loginErr = function (isLogin, rightPassword, hasUser) {
  var o = Object.create();
  o.isLogin = isLogin || false;
  o.rightPassword = rightPassword || false;
  o.hasUser = hasUser || false;
  return o;
};



