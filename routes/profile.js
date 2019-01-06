const express = require('express'),
  router = express.Router(),
  controller = require('../controller/profile');

router.use('', require('../middlewares/roles')([
  'user',
  'moderator',
  'administrator',
  'blocked'
]));

router.use('/edit', require('../middlewares/roles')([
  'user',
  'moderator',
  'administrator',
  'blocked'
]));

router.post('/edit', controller.update);

router.get('/edit', controller.profileEditPage);

router.get('', controller.profilePage);


module.exports = router;