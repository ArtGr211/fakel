const roles = require('../config/roles');

exports.removeEmpty = function (obj) {
  const newObj = {};
  for (let key in obj) {
    const val = obj[key];
    if (!(val == null || val.length === 0)) {
      newObj[key] = val;
    }
  }
  return newObj;
}

exports.checkAccessByRole = function (user, fields) {
  let role = roles[user ? user.role : 'guest'],
    field = role;
  fields.forEach(f => field = field ? field[f] : null);
  return field ? true : false;
}