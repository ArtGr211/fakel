const
  User = require('../model/user.model'),
  Article = require('../model/article.model'),
  ForumTopic = require('../model/forum/forum-topic.model');

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
      if (userProfile) {
        res.render('user/index', {
          userProfile: userProfile,
          articlesCount: articles.length,
          topicsCount: topics.length,
          pageTitle: userProfile.username,
          user: req.user
        });
      } else {
        next({
          status: 404,
          description: 'Пользователь не найден'
        })
      }
    })
    .catch(e => next())
}

exports.userBlogPostsPage = (req, res, next) => {
  Promise.all([
      User.findById(req.params.userId),
      Article.find({
        author: req.params.userId
      }),
    ])
    .then(([userProfile, articles]) => {
      res.render('user/blog', {
        user: req.user,
        pageTitle: `Статьи ${userProfile.username}`,
        userProfile: userProfile,
        articles: articles
      });
    })
    .catch(e => next())
}

exports.userForumTopicsPage = (req, res, next) => {
  Promise.all([
      User.findById(req.params.userId),
      ForumTopic.find({
        author: req.params.userId
      }),
    ])
    .then(([userProfile, topics]) => {
      res.render('user/forum', {
        user: req.user,
        pageTitle: `Темы форума ${userProfile.username}`,
        userProfile: userProfile,
        topics: topics
      });
    })
    .catch(e => next())
}