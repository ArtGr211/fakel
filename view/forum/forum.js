const hbs = require('hbs'),
  templateUtil = require('../../utils/template');

module.exports = function () {
  hbs.registerPartial('forumMessageForm', templateUtil.loadTemplate('forum/message-form'));
  hbs.registerPartial('forumMessage', templateUtil.loadTemplate('forum/message'));
}