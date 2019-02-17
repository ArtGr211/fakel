const
  User = require('../model/user.model'),
  Article = require('../model/article.model'),
  ForumTopic = require('../model/forum/forum-topic.model');

const USER_NOT_FOUND = 'Пользователь не найден';

exports.userProfilePage = (req, res, next) => {
  Promise.all([
      User.findById(req.params.userId),
      Article.find({
        author: req.params.userId
      }),
      ForumTopic.find({
        author: req.params.userId
      })
    ])
    .then(([userProfile, articles, topics]) => {
      if (!userProfile) {
        const error = new Error(USER_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      res.render('user/index', {
        userProfile: userProfile,
        articlesCount: articles.length,
        topicsCount: topics.length,
        pageTitle: userProfile.username,
        user: req.user,
        breadcrumbs: true
      });
    })
    .catch(err => next(err));
}

exports.userBlogPostsPage = (req, res, next) => {
  Promise.all([
      User.findById(req.params.userId),
      Article.find({
        author: req.params.userId
      }),
    ])
    .then(([userProfile, articles]) => {
      if (!userProfile) {
        const error = new Error(USER_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      res.render('user/blog', {
        user: req.user,
        pageTitle: `Статьи ${userProfile.username}`,
        userProfile: userProfile,
        articles: articles,
        breadcrumbs: true
      });
    })
    .catch(err => next(err));
}

exports.userForumTopicsPage = (req, res, next) => {
  Promise.all([
      User.findById(req.params.userId),
      ForumTopic.find({
        author: req.params.userId
      }),
    ])
    .then(([userProfile, topics]) => {
      if (!userProfile) {
        const error = new Error(USER_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      res.render('user/forum', {
        user: req.user,
        pageTitle: `Темы форума ${userProfile.username}`,
        userProfile: userProfile,
        topics: topics,
        breadcrumbs: true
      });
    })
    .catch(err => next(err))
}