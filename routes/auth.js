const express = require('express'),
  router = express.Router(),
  controller = require('../controller/auth');

router.use('/login', require('../middlewares/roles')(['guest'], '/profile'));
router.get('/login', controller.loginPage);
router.post('/login', controller.login);

router.use('/registration', require('../middlewares/roles')(['guest'], '/profile'));
router.get('/registration', controller.registrationPage);
router.post('/registration', controller.registration);

router.use('/logout', controller.logout);

module.exports = router;