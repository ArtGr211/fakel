const
  helpers = require('../utils/helpers'),
  Article = require('../model/article.model'),
  Comment = require('../model/comment.model'),
  siteConfig = require('../config/site');

const ARTICLE_NOT_FOUND = 'Статья не найдена';
const ARTICLE_NO_EDIT_ACCESS = 'Нет прав на редактирование статьи';
const ARTICLE_NO_DELETE_ACCESS = 'Нет прав на удаление статьи';
const COMMENT_NOT_FOUND = 'Комментарий не найден';
const COMMENT_NO_EDIT_ACCESS = 'Нет прав на редактирование комментария';
const COMMENT_NO_DELETE_ACCESS = 'Нет прав на удаление комментария';

exports.articlesListPage = (req, res, next) => {
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
      (([articles, count]) => {
        const
          pagination = helpers.pagination({
            current: page,
            show: 2,
            perPage: siteConfig.blog.articlesPerPage,
            link: '/blog?page=',
            total: count
          });
        res.render(
          'blog/list.hbs', {
            user: req.user,
            pageTitle: 'Блог',
            addArticleAccess: helpers.checkAccessByRole(req.user, ['blog', 'articles', 'create']),
            articles: articles.map(
              article => {
                if (article.text.length > 300) {
                  article.text = article.text.slice(0, 300) + '...';
                }
                return article;
              }
            ),
            pagination: pagination
          })
      })
    )
    .catch(err => next(err));
}

exports.articlePage = (req, res, next) => {
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
    .then(
      article => {
        if (!article) {
          const error = new Error(ARTICLE_NOT_FOUND);
          error.status = 404;
          throw error;
        }
        article.comments.forEach(
          comment => {
            comment.access = {
              edit: helpers.authorAccess(comment, req.user, ['blog', 'comments'], 'edit'),
              delete: helpers.authorAccess(comment, req.user, ['blog', 'comments'], 'delete')
            }
          }
        )
        res.render(
          'blog/article.hbs', {
            user: req.user,
            pageTitle: article.title,
            article: article,
            commentForm: {
              url: `/blog/${article.id}/comments`,
              authorField: req.user ? false : true,
              title: 'Добавить комментарий'
            },
            access: {
              comments: helpers
                .checkAccessByRole(
                  req.user,
                  ['blog', 'comments', 'create']
                ),
              edit: helpers.authorAccess(article, req.user, ['blog', 'articles'], 'edit'),
              delete: helpers.authorAccess(article, req.user, ['blog', 'articles'], 'delete'),
            },
            commentsEditUrl: `/blog/${article.id}/comments`,
            commentsDeleteUrl: `/blog/${article.id}/comments`
          })
      }
    )
    .catch(err => next(err));
}

exports.createArticlePage = (req, res) => {
  res
    .render(
      'blog/edit.hbs', {
        user: req.user,
        pageTitle: 'Добавить статью',
        editForm: {
          url: '/blog/create'
        }
      })
}

exports.editArticlePage = (req, res, next) => {
  Article.findById(req.params.articleId)
    .populate('author')
    .then(article => {
      if (!article) {
        const error = new Error(ARTICLE_NOT_FOUND);
        error.status = 404;
        throw error;
      }
      const access = helpers.authorAccess(article, req.user, ['blog', 'articles'], 'edit');
      if (access) {
        res.render(
          'blog/edit.hbs', {
            user: req.user,
            pageTitle: `Редактирование статьи ${article.title}`,
            editForm: {
              url: `/blog/${article._id}/edit`,
              value: article
            }
          })
      } else {
        const error = new Error(ARTICLE_NO_EDIT_ACCESS);
        error.status = 403;
        throw error;
      }
    })
    .catch(err => next(err));
}

exports.editCommentPage = (req, res, next) => {
  Promise.all([
      Article
      .findById(req.params.articleId)
      .populate([{
        path: 'author'
      }]),
      Comment.findById(req.params.commentId)
    ])
    .then(
      ([article, comment]) => {
        if (!article) {
          const error = new Error(ARTICLE_NOT_FOUND);
          error.status = 404;
          throw error;
        }
        if(!comment) {
          const error = new Error(COMMENT_NOT_FOUND);
          error.status = 404;
          throw error;
        }
        const access = helpers.authorAccess(
          comment,
          req.user,
          ['blog', 'comments'],
          'edit'
        );
        if (access) {
          res.render(
            'blog/article', {
              user: req.user,
              pageTitle: article.title,
              article: article,
              commentForm: {
                url: `/blog/${article.id}/comments/${req.params.commentId}/edit`,
                value: comment,
                authorField: comment.authorName ? true : false,
                title: 'Редактировать комментарий'
              },
              editComment: true
            })
        } else {
          const error = new Error('Нет доступа к редактированию комментария');
          error.status = 403;
          throw error;
        }
      }
    )
    .catch(err => next(err));
}

exports.createArticle = (req, res, next) => {
  const newArticle = new Article({
    title: req.body.title,
    text: req.body.text,
    author: req.user.id
  });
  newArticle.save()
    .then(article => res.redirect(`/blog/${article.id}`))
    .catch(err => next(err));
}

exports.updateArticle = (req, res, next) => {
  Article
    .findById(req.params.articleId)
    .then(
      article => {
        if (!article) {
          const error = new Error(ARTICLE_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const access = helpers.authorAccess(article, req.user, ['blog', 'articles'], 'edit');
        if (access) {
          article.set(req.body);
          article
            .save()
            .then(() => res.redirect(`/blog/${req.params.articleId}/`))
        } else {
          const error = new Error(ARTICLE_NO_EDIT_ACCESS);
          error.status = 403;
          throw error;
        }
      }
    ).catch(err => next(err))
}

exports.deleteArticle = (req, res, next) => {
  Article
    .findById(req.params.articleId)
    .then(
      article => {
        if (!article) {
          const error = new Error(ARTICLE_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const access = helpers.authorAccess(article, req.user, ['blog', 'articles'], 'delete');
        if (access) {
          article
            .remove()
            .then(() => res.redirect('/blog/'))
        } else {
          const error = new Error(ARTICLE_NO_EDIT_ACCESS);
          error.status = 403;
          throw error;
        }
      }
    ).catch(err => next(err));
}

exports.addComment = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then(
      article => {
        if (!article) {
          const error = new Error(ARTICLE_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const comment = {
          text: req.body.text,
          subject: article.id,
          subjectModel: 'Article'
        }

        if (req.user) {
          comment.author = req.user._id;
        } else {
          comment.authorName = req.body.authorName;
        }

        const newComment = new Comment(comment);

        return newComment
          .save()
          .then(comment => {
            article.comments.push(comment.id);
            return article.save();
          })
          .then(() => res.redirect(`/blog/${req.params.articleId}`))
      }
    )
    .catch(err => next(err))
}

exports.deleteComment = (req, res, next) => {
  Comment
    .findById(req.params.commentId)
    .then(comment => {
      if (!comment) {
        const error = new Error(COMMENT_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      const access = helpers.authorAccess(
        comment,
        req.user,
        ['blog', 'comments'],
        'delete'
      )

      if (access) {
        comment
          .remove()
          .then(() => res.redirect(`/blog/${req.params.articleId}`))
      } else {
        const error = new Error(COMMENT_NO_DELETE_ACCESS);
        error.status = 403;
        throw error;
      }
    })
    .catch(err => next(err));
}

exports.updateComment = (req, res, next) => {
  Comment
    .findById(req.params.commentId)
    .then(comment => {
      if (!comment) {
        const error = new Error(error);
        error.status = 404;
        throw error;
      }

      const access = helpers.authorAccess(
        comment,
        req.user,
        ['blog', 'comments'],
        'edit'
      );

      if (access) {
        comment.set(req.body);
        return comment
          .save()
          .then(res.redirect(`/blog/${req.params.articleId}`))
      } else {
        const error = new Error(COMMENT_NO_EDIT_ACCESS);
        error.status = 403;
        throw error;
      }
    })
    .catch(err => next(err));
}