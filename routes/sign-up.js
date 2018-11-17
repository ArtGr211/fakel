const express = require('express'),
  router = express.Router(),
  controller = require('../controller/sign-up');

router.use('', require('../middlewares/roles')(['guest'], '/profile'));
router.get('', controller.signUp);

router.post('', controller.registerUser);

module.exports = router;