const hbs = require('hbs'),
  templateUtil = require('../../utils/template');

module.exports = function () {
  hbs.registerPartial('userHeader', templateUtil.loadTemplate('user/user-header'));
}