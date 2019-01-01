const hbs = require('handlebars'),
  templateUtil = require('../../../utils/template');

module.exports = function () {
  hbs.registerPartial('pagination', templateUtil.loadTemplate('widgets/pagination/pagination'));
}