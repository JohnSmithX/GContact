/**
 * Created by xus on 14-11-20.
 */

  //lodash function utils
global._ = require('lodash');


//全局不可变静态变量
var ms = global.MS = 1;
var minute = global.MINUTE = 60000 * ms;
var hour = global.HOUR = 60 * minute;
var day = global.DAY = 24 * hour;

var month = global.MONTH = function (month, options) {
  var today = new Date();

  options = options || {};

  function isLeapYear(year) {
    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
  }

  var tempYear = options.year || today.getFullYear();
  var tempMonth = month == 0
    ? 0
    : month || today.getMonth() + 1;

  var year = parseInt(tempYear, 10);
  month = parseInt(tempMonth, 10);

  if (!year || !month || year < 0 || (month < 1 || month > 12)) {
    throw new Error("Incorrect value year: '" + tempYear + "' or month: '" + tempMonth + "'");
  }

  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 2:
      return isLeapYear(year)
        ? 29
        : 28;
    default:
      return 30;
  }
};


//获取更目录
var path = require('path');
global.RootPath = path.normalize(__dirname + '/..');
