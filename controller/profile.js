const templateUtils = require('../utils/template');

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