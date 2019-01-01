const
  moment = require('moment'),
  templateUtils = require('../utils/template'),
  helpers = require('../utils/helpers'),
  Article = require('../model/article.model'),
  Comment = require('../model/comment.model'),
  siteConfig = require('../config/site');

function articlePrettyDate(article) {
  article.createdAtStr = moment(article.createdAt).format('DD.MM.YYYY HH:mm');
  return article;
}

exports.articlesListPage = (req, res) => {
  const page = req.query.page ? +req.query.page : 1;

  Promise.all([
      Article
      .find()
      .skip((page - 1) * siteConfig.blog.articlesPerPage)
      .limit(siteConfig.blog.articlesPerPage)
      .sort('-createdAt')
      .populate('author'),
      Article.countDocuments()
    ])
    .then(
      (data => {
        const
          articles = data[0],
          count = data[1],
          pagination = helpers.pagination({
            current: page,
            show: 2,
            link: '/blog?page=',
            total: Math.floor(count / siteConfig.blog.articlesPerPage)
          });
        res.send(
          templateUtils.renderTemplate('blog/list', {
            user: req.user,
            pageTitle: 'Blog',
            articles: articles.map(
                article => {
                  if (article.text.length > 100) {
                    article.text = article.text.slice(0, 100) + '...';
                  }
                  return article;
                }
              )
              .map(articlePrettyDate),
            pagination: pagination
          })
        )
      })
    )
}

exports.articlePage = (req, res) => {
  Article
    .findById(req.params.articleId)
    .populate([{
        path: 'author'
      },
      {
        path: 'comments',
        populate: {
          path: 'author'
        }
      }
    ])
    .then(articlePrettyDate)
    .then(
      article => res.send(
        templateUtils.renderTemplate('blog/article', {
          user: req.user,
          pageTitle: article.title,
          article: article,
          commentsForm: {
            url: `/blog/${article.id}/comment`
          },
          access: {
            comments: helpers
              .checkAccessByRole(
                req.user,
                ['blog', 'comments', 'create']
              ),
            edit: helpers.authorAccess(article, req.user, ['blog', 'articles'], 'edit'),
            delete: helpers.authorAccess(article, req.user, ['blog', 'articles'], 'delete'),
          }
        })
      )
    )
}

exports.createArticlePage = (req, res) => {
  res.send(
    templateUtils.renderTemplate('blog/edit', {
      user: req.user,
      pageTitle: 'Create article',
      editForm: {
        url: '/blog/create'
      }
    })
  )
}

exports.editArticlePage = (req, res) => {
  Article.findById(req.params.articleId)
    .populate('author')
    .then(article => {
      const access = helpers.authorAccess(article, req.user, ['blog', 'articles'], 'edit');
      if (access) {
        res.send(
          templateUtils.renderTemplate('blog/edit', {
            user: req.user,
            pageTitle: 'Create article',
            editForm: {
              url: `/blog/${article._id}/edit`,
              value: article
            }
          })
        )
      } else {
        res.send(403);
      }
    })
}

exports.createArticle = (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    text: req.body.text,
    author: req.user.id
  });
  newArticle.save()
    .then(() => res.redirect('/blog'));
}

exports.updateArticle = (req, res) => {
  Article
    .findById(req.params.articleId)
    .then(
      article => {
        const access = helpers.authorAccess(article, req.user, ['blog', 'articles'], 'edit');
        if (access) {
          article.set(req.body);
          article
            .save()
            .then(() => res.redirect(`/blog/${req.params.articleId}/`))
        } else {
          res.sendStatus(403);
        }
      }
    )
}

exports.deleteArticle = (req, res) => {
  Article
    .findById(req.params.articleId)
    .then(
      article => {
        const access = helpers.authorAccess(article, req.user, ['blog', 'articles'], 'delete');
        if (access) {
          article
            .remove()
            .then(() => res.redirect('/blog/'))
        } else {
          res.sendStatus(403);
        }
      }
    )
}

exports.addComment = (req, res) => {
  Article.findById(req.params.articleId)
    .then(
      article => {
        const comment = {
          text: req.body.text
        }

        if (req.user) {
          comment.author = req.user._id;
        } else {
          comment.authorName = req.body.authorName;
        }

        const newComment = new Comment(comment);

        newComment
          .save()
          .then(comment => {
            article.comments.push(comment.id);
            return article.save();
          })
          .then(() => res.redirect(`/blog/${req.params.articleId}`))
      }
    )
}