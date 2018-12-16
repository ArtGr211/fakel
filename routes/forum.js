const express = require('express'),
  router = express.Router(),
  middlewareRoles = require('../middlewares/roles'),
  controller = require('../controller/forum');

router.use('/create', middlewareRoles(['administrator']));

router.get('/create', controller.editForumPage);

router.post('/create', controller.createForum);

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

router.get('/:forum/create', controller.editTopicPage);

router.post('/:forum/create', controller.createTopic);

router.get('/:forum/:topicId/edit', controller.editTopicPage);

router.post('/:forum/:topicId/edit', controller.updateTopic);

router.get('/:forum/:topicId', controller.topicPage);

router.post('/:forum/:topicId', controller.createMessage);

router.get('/:forum/:topicId/:messageId/edit', controller.editMessagePage);

router.post('/:forum/:topicId/:messageId/edit', controller.updateMessage);

router.get('/', controller.forumsListPage);

module.exports = router;