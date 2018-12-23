const express = require('express'),
  router = express.Router(),
  middlewareRoles = require('../middlewares/roles'),
  controller = require('../controller/blog');

router.use('/create', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.get('/create', controller.createArticlePage);

router.post('/create', controller.createArticle);

router.get('/:id/delete', controller.deleteArticle);

router.post('/:id/comment', controller.addComment);

router.get('/:id', controller.articlePage);

router.post('/:id', controller.updateArticle);

router.get('/', controller.articlesListPage);

module.exports = router;