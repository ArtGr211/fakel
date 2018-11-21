const templateUtils = require('../utils/template'),
  Article = require('../model/article.model');

exports.getList = (req, res) => {
  Article
    .find()
    .populate('author')
    .then(
      (articles => res.send(articles))
    )
}

exports.getItem = (req, res) => {
  res.send('item');
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