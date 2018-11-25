const hbs = require('handlebars'),
  templateUtil = require('../../../utils/template');

module.exports = function () {
  hbs.registerPartial('commentsList', templateUtil.loadTemplate('widgets/comments/comments'));
  hbs.registerPartial('commentForm', templateUtil.loadTemplate('widgets/comments/form'));
}