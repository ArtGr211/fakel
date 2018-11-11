const express = require('express'),
  router = express.Router(),
  controller = require('../controller/main');

router.get('', controller.mainPage);

module.exports = router;