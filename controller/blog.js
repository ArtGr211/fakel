const templateUtils = require('../utils/template'),
  Article = require('../model/article.model');

exports.getList = (req, res) => {
  Article
    .find()
    .populate('author')
    .then(
      (articles => res.send(
        templateUtils.renderTemplate('blog/list', {
          user: req.user,
          articles: articles.map(
            article => {
              if (article.text.length > 100) {
                article.text = article.text.slice(0, 100) + '...';
              }
              return article;
            }
          )
        })
      ))
    )
}

exports.getItem = (req, res) => {
  Article
    .findById(req.params.id)
    .populate('author')
    .then(
      article => res.send(
        templateUtils.renderTemplate('blog/article', {
          user: req.user,
          article: article
        })
      )
    )
}

exports.createForm = (req, res) => {
  res.send(
    templateUtils.renderTemplate('blog/create', {
      user: req.user,
      pageTitle: 'Create article'
    })
  )
}

exports.createItem = (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    text: req.body.text,
    author: req.user.id
  });
  newArticle.save()
    .then(() => res.redirect('/blog'));
}

exports.updateItem = (req, res) => {
  res.send('update');
}

exports.deleteItem = (req, res) => {
  res.send('delete');
}