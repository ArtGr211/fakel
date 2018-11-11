const express = require('express'),
  router = express.Router(),
  controller = require('../controller/profile');

router.get('', controller.view);

module.exports = router;