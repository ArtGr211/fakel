const express = require('express'),
  router = express.Router(),
  controller = require('../controller/user');

router.get('/:userId', controller.userProfilePage);

router.get('/:userId/blog', controller.userBlogPostsPage);

router.get('/:userId/forum', controller.userForumTopicsPage);

module.exports = router;