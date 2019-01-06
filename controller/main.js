const templateUtils = require('../utils/template');

exports.mainPage = (req, res) => {
  res.render('main.hbs', {
    message: 'New message',
    user: req.user,
    pageTitle: 'Main page'
  })
};