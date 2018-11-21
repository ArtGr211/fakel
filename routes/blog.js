const express = require('express'),
  router = express.Router(),
  middlewareRoles = require('../middlewares/roles'),
  controller = require('../controller/blog');

router.use('/create', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.get('/create', controller.createForm);

router.post('/create', controller.createItem);

router.get('/:id', controller.getItem);

router.post('/:id', controller.updateItem);

router.get('/:id/delete', controller.deleteItem);

router.get('/', controller.getList);

module.exports = router;