const templateUtils = require('../utils/template');

exports.mainPage = (req, res) => {
  res.send(templateUtils.renderTemplate('main', {
    message: 'New message',
    user: req.user,
    pageTitle: 'Main page'
  }))
};