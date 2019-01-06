const express = require('express'),
  router = express.Router(),
  middlewareRoles = require('../middlewares/roles'),
  controller = require('../controller/blog');

router.use('/create', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.use('/:articleId/edit', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.use('/:articleId/delete', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.use('/:articleId/comments/:commentId/delete', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.use('/:articleId/comments/:commentId/edit', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.get('/create', controller.createArticlePage);

router.post('/create', controller.createArticle);

router.get('/:articleId/delete', controller.deleteArticle);

router.post('/:articleId/comments', controller.addComment);

router.get('/:articleId', controller.articlePage);

router.get('/:articleId/edit', controller.editArticlePage);

router.post('/:articleId/edit', controller.updateArticle);

router.get('/', controller.articlesListPage);

router.use('/:articleId/comments/:commentId/delete', controller.deleteComment);

router.get('/:articleId/comments/:commentId/edit', controller.editCommentPage);

router.post('/:articleId/comments/:commentId/edit', controller.updateComment);

module.exports = router;