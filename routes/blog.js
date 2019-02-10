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

router.use('/blog/:articleId/comments/:commentId/edit', middlewareRoles([
  'moderator',
  'user',
  'administrator'
]))

router.get('/blog/create', controller.createArticlePage);

router.post('/blog/create', controller.createArticle);

router.get('/blog/:articleId/delete', controller.deleteArticle);

router.post('/blog/:articleId/comments', controller.addComment);

router.get('/blog/:articleId', controller.articlePage);

router.get('/blog/:articleId/edit', controller.editArticlePage);

router.post('/blog/:articleId/edit', controller.updateArticle);

router.get('/', controller.articlesListPage);

router.use('/blog/:articleId/comments/:commentId/delete', controller.deleteComment);

router.get('/blog/:articleId/comments/:commentId/edit', controller.editCommentPage);

router.post('/blog/:articleId/comments/:commentId/edit', controller.updateComment);

module.exports = router;