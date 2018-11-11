const templateUtil = require('../utils/template'),
  User = require('../model/user.model');

exports.form = (req, res) => {
  res.send(
    templateUtil.renderTemplate(
      'sign-in', {
        pageTitle: 'Sign in',
        user: req.user
      })
  )
}

exports.login = (req, res) => {
  User.auth(
    req.body.email,
    req.body.password,
    (err, user) => {
      if (err) {
        res.send(
          templateUtil.renderTemplate(
            'errors/error', {
              pageTitle: 'Error',
              user: req.user
            }
          )
        )
      } else if (user) {
        req.session.userId = user._id;
        res.redirect('/')
      }
    }
  )
}