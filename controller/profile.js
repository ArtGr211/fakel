const templateUtils = require('../utils/template'),
  helpers = require('../utils/helpers'),
  User = require('../model/user.model');

exports.view = (req, res) => {
  res.send(
    templateUtils.renderTemplate(
      'profile/profile', {
        user: req.user,
        pageTitle: 'Profile',
        user: req.user
      }
    )
  )
}

exports.update = (req, res) => {
  User.findByIdAndUpdate(
      req.user._id, {
        $set: helpers.removeEmpty(req.body)
      }
    )
    .then(
      user => {
        res.redirect(req.get('referer'))
      }
    )
}