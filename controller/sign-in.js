const templateUtil = require('../utils/template'),
  User = require('../model/user.model');

exports.form = (req, res) => {
  res.send(
    templateUtil.renderTemplate('sign-in.hbs')
  )
}

exports.login = (req, res) => {
  User.auth(
    req.body.email,
    req.body.password,
    (err, user) => {
      if (err) {
        res.send(templateUtil.renderTemplate('errors/error.hbs'))
      } else if (user) {
        req.session.userId = user._id;
        res.send(templateUtil.renderTemplate('main.hbs', { user: user }))
      }
    }
  )
}