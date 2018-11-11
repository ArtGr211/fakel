const hbs = require('handlebars'),
  fs = require('fs');

module.exports = {
  loadTemplate(path) {
    return fs.readFileSync(`view/${path}.hbs`, 'utf8');
  },
  renderTemplate(path, data) {
    return hbs.compile(this.loadTemplate(path))(data);
  }
}