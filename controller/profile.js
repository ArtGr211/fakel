const templateUtils = require('../utils/template');

exports.view = (req, res) => {
  if (req.user) {
    res.send(
      templateUtils.renderTemplate(
        'profile/profile', {
          user: req.user,
          pageTitle: 'Profile',
          user: req.user
        }
      )
    )
  } else {
    res.sendStatus(401);
  }
}