const hbs = require('handlebars'),
  templateUtil = require('../../utils/template');

module.exports = function () {
  hbs.registerPartial('forumMessageForm', templateUtil.loadTemplate('forum/message-form'));
}