const User = require('../model/user.model');

module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(() => {
        next();
      })
  } else {
    next();
  }
}