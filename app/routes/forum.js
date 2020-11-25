const express = require('express'),
  router = express.Router(),
  middlewareRoles = require('../middlewares/roles'),
  controller = require('../controller/forum');

router.get('/newest', controller.newestMessagesPage);

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

router.get('/:forum/create', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.createTopicPage);

router.post('/:forum/create', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.createTopic);

router.get('/:forum/:topicId/edit', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.editTopicPage);

router.post('/:forum/:topicId/edit', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.updateTopic);

router.get('/:forum/:topicId', controller.topicPage);

router.post(
  '/:forum/:topicId', middlewareRoles([
    'administrator',
    'moderator',
    'user'
  ]),
  controller.createMessage,
);

router.get('/:forum/:topicId/:messageId/edit', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.editMessagePage);

router.post('/:forum/:topicId/:messageId/edit', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.updateMessage);

router.use('/:forum/:topicId/:messageId/delete', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.deleteMessage);

router.use('/:forum/:topicId/delete', middlewareRoles([
  'administrator',
  'moderator',
  'user'
]), controller.deleteTopic);

router.get('/', controller.forumsListPage);

module.exports = router;