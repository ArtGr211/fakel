const templateUtil = require('../utils/template'),
  User = require('../model/user.model');

exports.registerUser = (req, res) => {
  const newUser = new User({
    username: req.body.login,
    email: req.body.email,
    password: req.body.password
  });
  newUser.save()
    .then((user) =>
      res.redirect('/sign-in')
    )
    .catch(e => res.send(
      templateUtil.renderTemplate('errors/error')
    ))
}

exports.signUp = (req, res) => {
  res.send(templateUtil.renderTemplate('sign-up/sign-up'))
}