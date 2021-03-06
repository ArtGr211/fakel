const sanitizeHtml = require('sanitize-html');
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

const pagination = function (options) {
  options.current = +options.current;
  const
  totalPages = Math.ceil(options.total / options.perPage),
  pagination = {
    current: +options.current,
    before: [],
    after: [],
    totalPages: totalPages,
    show: totalPages > 1
  }

  let
    from = options.current - options.show,
    to = options.current + options.show;

  if (from < 1) from = 1;
  if (to > totalPages) to = totalPages;

  if (from > 1) {
    pagination.first = {
      index: 1,
      link: options.link + 1
    }
  }

  if (to < totalPages) {
    pagination.last = {
      index: totalPages,
      link: options.link + totalPages
    }
  }

  for (let i = from; i < options.current; i++) {
    pagination.before.push({
      index: i,
      link: options.link + i
    })
  }

  for (let i = options.current + 1; i <= to; i++) {
    pagination.after.push({
      index: i,
      link: options.link + i
    })
  }
  return pagination;
}

const htmlToPlainText = function (html) {
  return sanitizeHtml(
    html,
    {
      allowedTags: []
    }
  ).trim()
}

exports.removeEmpty = removeEmpty;
exports.checkAccessByRole = checkAccessByRole;
exports.checkBoxToBoolean = checkBoxToBoolean;
exports.authorAccess = authorAccess;
exports.pagination = pagination;
exports.htmlToPlainText = htmlToPlainText;