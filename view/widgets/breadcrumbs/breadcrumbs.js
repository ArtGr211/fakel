const hbs = require('hbs'),
  templateUtil = require('../../../utils/template');

module.exports = function () {
  hbs.registerPartial('breadcrumbs', templateUtil.loadTemplate('widgets/breadcrumbs/breadcrumbs'));
}