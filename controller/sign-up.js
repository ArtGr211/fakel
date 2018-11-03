const hbs = require('handlebars'),
  fs = require('fs'),
  template = fs.readFileSync('view/sign-up.hbs', 'utf8');

exports.registerUser = (req, res) => {
  res.send(req.body)
}

exports.signUp = (req, res) => {
  res.send(hbs.compile(template)())
}