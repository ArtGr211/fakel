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
  if (req.body.privacySettings) {
    req.body.privacySettings.showBirthdate = helpers.checkBoxToBoolean(req.body.privacySettings.showBirthdate);
    req.body.privacySettings.showEmail = helpers.checkBoxToBoolean(req.body.privacySettings.showEmail);
  } else {
    req.body.privacySettings = {
      showBirthdate: false,
      showEmail: false
    }
  }
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