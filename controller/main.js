const templateUtils = require('../utils/template'),
  User = require('../model/user.model');

exports.mainPage = (req, res) => {
  User.findBySession(req)
    .then((user) => {
      res.send(templateUtils.renderTemplate('main', {
        message: 'New message',
        user: user
      }))
    })
};