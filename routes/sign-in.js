const express = require('express'),
  router = express.Router(),
  controller = require('../controller/sign-in');

router.get('', controller.form);
router.post('', controller.login);

module.exports = router;