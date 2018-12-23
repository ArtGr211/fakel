const express = require('express'),
  router = express.Router(),
  controller = require('../controller/profile');

router.use('', require('../middlewares/roles')([
  'user',
  'moderator',
  'administrator',
  'blocked'
]));

router.get('', controller.profilePage);

router.post('', controller.update);

module.exports = router;