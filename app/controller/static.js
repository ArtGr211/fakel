const fs = require('fs'),
  path = require('path'),
  staticOptions = require('../config/static-html');

exports.staticPage = (req, res, next) => {
  const filePath = path.join(__basedir, 'static', ...req.path.split('/'));
  new Promise((resolve, reject) => {
      fs.readFile(
        filePath,
        'utf-8',
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      )
    })
    .then(staticHtml => res.render('static/static', Object.assign({
      staticHtml,
      user: req.user,
      breadcrumbs: true
    }, staticOptions[req.path])))
    .catch(err => next(err));
}