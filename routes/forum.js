const express = require('express'),
  router = express.Router(),
  middlewareRoles = require('../middlewares/roles'),
  controller = require('../controller/forum');

router.get('/:forum', controller.forumPage);

router.use('/:forum/create', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]));

router.use('/:forum/:topicId/edit', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]));

router.use('/:forum/:topicId/delete', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]))

router.get('/:forum/create', controller.createTopicPage);

router.post('/:forum/create', controller.createTopic);

router.get('/:forum/:topicId/edit', controller.editTopicPage);

router.post('/:forum/:topicId/edit', controller.updateTopic);

router.get('/:forum/:topicId', controller.topicPage);

router.post('/:forum/:topicId', controller.createMessage);

router.get('/:forum/:topicId/:messageId/edit', controller.editMessagePage);

router.post('/:forum/:topicId/:messageId/edit', controller.updateMessage);

router.use('/:forum/:topicId/:messageId/delete', controller.deleteMessage);

router.use('/:forum/:topicId/delete', controller.deleteTopic);

router.get('/newest', controller.newestMessagesPage);

router.get('/', controller.forumsListPage);

module.exports = router;