const roles = require('../config/roles');

const removeEmpty = function (obj) {
  const newObj = {};
  for (let key in obj) {
    const val = obj[key];
    if (!(val == null || val.length === 0)) {
      newObj[key] = val;
    }
  }
  return newObj;
}

const checkAccessByRole = function (user, fields) {
  let role = roles[user ? user.role : 'guest'],
    field = role;
  fields.forEach(f => field = field ? field[f] : null);
  return field ? true : false;
}

const checkBoxToBoolean = function (checkbox) {
  if (typeof checkbox === 'boolean') return checkbox;
  return checkbox === 'on' ? true : false;
}

const authorEditAccess = function (data, user, query) {
  return (
      user &&
      data.author &&
      data.author.equals(user._id)
    ) ||
    checkAccessByRole(user, query);
}

exports.removeEmpty = removeEmpty;
exports.checkAccessByRole = checkAccessByRole;
exports.checkBoxToBoolean = checkBoxToBoolean;
exports.authorEditAccess = authorEditAccess;