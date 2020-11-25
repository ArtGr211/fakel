const hbs = require('hbs'),
  fs = require('fs');

module.exports = {
  loadTemplate(path) {
    return fs.readFileSync(`view/${path}.hbs`, 'utf8');
  }
}