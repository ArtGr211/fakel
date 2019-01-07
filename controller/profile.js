const
  helpers = require('../utils/helpers'),
  User = require('../model/user.model');

exports.profilePage = (req, res) => {
  res.render(
    'profile/profile.hbs', {
      user: req.user,
      pageTitle: 'Profile'
    }
  )
}

exports.profileEditPage = (req, res) => {
  res.render(
    'profile/edit.hbs', {
      user: req.user,
      pageTitle: 'Edit profiel'
    }
  )
}

exports.update = (req, res) => {
  delete req.body.role;
  User.findByIdAndUpdate(
      req.user._id, {
        $set: helpers.removeEmpty(req.body)
      }
    )
    .then(
      user => {
        res.redirect('/profile')
      }
    )
}