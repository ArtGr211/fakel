const hbs = require('handlebars'),
  fs = require('fs'),
  template = fs.readFileSync('view/main.hbs', 'utf8');

exports.mainPage = (req, res) => {
  res.send(hbs.compile(template)({ message: 'It works!' }))
};