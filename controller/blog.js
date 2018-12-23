const
  moment = require('moment'),
  templateUtils = require('../utils/template'),
  helpers = require('../utils/helpers'),
  Article = require('../model/article.model');

function articlePrettyDate(article) {
  article.createdAtStr = moment(article.createdAt).format('DD.MM.YYYY HH:mm');
  return article;
}

exports.articlesListPage = (req, res) => {
  Article
    .find()
    .populate('author')
    .then(
      (articles => res.send(
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
            .map(articlePrettyDate)
        })
      ))
    )
}

exports.articlePage = (req, res) => {
  Article
    .findById(req.params.id)
    .populate('author')
    .populate('comments.author')
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
          allowComments: helpers
            .checkAccessByRole(
              req.user,
              ['blog', 'allowComments']
            )
        })
      )
    )
}

exports.createArticlePage = (req, res) => {
  res.send(
    templateUtils.renderTemplate('blog/create', {
      user: req.user,
      pageTitle: 'Create article'
    })
  )
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
  res.send('update');
}

exports.deleteArticle = (req, res) => {
  res.send('delete');
}

exports.addComment = (req, res) => {
  Article.findById(req.params.id)
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

        article.comments.push(comment);
        article.save();
        res.redirect(`/blog/${req.params.id}`)
      }
    )
}