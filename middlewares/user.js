const User = require('../model/user.model'),
  roles = require('../utils/roles');

module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        req.user = user;
        req.user.access = roles[user.role];
        next();
      })
      .catch(() => {
        next();
      })
  } else {
    next();
  }
}