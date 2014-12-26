/**
 * Created by xus on 14-11-9.
 */

//isNumber except `NaN`
function isNumber(value) {
  var type = typeof value;
  return (type == 'number' || (value && type == 'object' && Object.prototype.toString.call(value) == '[object Number]') || false) && value == +value;
}


exports.validNumber = function (name) {
  return function (req, res, next) {
    var num = Number(req.params[name]);
    if (isNumber(num)) {
      return next();
    }
    res.render('chatrooms/list', {});
  };
}