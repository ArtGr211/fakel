const express = require('express'),
  router = express.Router(),
  controller = require('../controller/profile');

router.use('', require('../middlewares/roles')([
  'user',
  'moderator',
  'administrator',
  'blocked'
]));

router.get('', controller.view);

router.post('', controller.update);

module.exports = router;