const templateUtils = require('../utils/template');

exports.mainPage = (req, res) => {
  res.send(templateUtils.renderTemplate('main.hbs', { message: 'New message' }))
};