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

const authorAccess = function (data, user, query, accessType) {
  let accessQueryOwn = [].concat(query),
    accessQueryAll = [].concat(query);
  switch (accessType) {
    case 'edit':
      accessQueryOwn.push('editOwn');
      accessQueryAll.push('editAll');
      break;
    case 'delete':
      accessQueryOwn.push('deleteOwn');
      accessQueryAll.push('deleteAll');
  }

  const
    own = checkAccessByRole(user, accessQueryOwn),
    all = checkAccessByRole(user, accessQueryAll);

  return all ? all : own && data.author && data.author.equals(user._id);
}

exports.removeEmpty = removeEmpty;
exports.checkAccessByRole = checkAccessByRole;
exports.checkBoxToBoolean = checkBoxToBoolean;
exports.authorAccess = authorAccess;