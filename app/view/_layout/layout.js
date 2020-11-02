const hbs = require('hbs'),
  templateUtil = require('../../utils/template');

module.exports = function() {
  hbs.registerPartial('sidebar', templateUtil.loadTemplate('_layout/sidebar'));
  hbs.registerPartial('footer', templateUtil.loadTemplate('_layout/footer'));
  hbs.registerPartial('layout', templateUtil.loadTemplate('_layout/layout'));
}