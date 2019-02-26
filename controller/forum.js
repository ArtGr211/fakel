const
  sanitizeHtml = require('sanitize-html'),
  siteConfig = require('../config/site'),
  Forum = require('../model/forum/forum.model'),
  ForumTopic = require('../model/forum/forum-topic.model'),
  ForumMessage = require('../model/forum/forum-message.model'),
  helpers = require('../utils/helpers');

const FORUM_NOT_FOUND = 'Форум не найден';
const TOPIC_NOT_FOUND = 'Тема не найдена';
const TOPIC_NO_EDIT_ACCESS = 'Нет прав на редактирование темы';
const TOPIC_NO_DELETE_ACCESS = 'Нет прав на удаление темы';
const TOPIC_TITLE_CANNOT_BE_EMPTY = 'Заголовок темы не может быть пустым';
const TOPIC_DESCRIPTION_CANNOT_BE_EMPTY = 'Описание темы не может быть пустым';
const MESSAGE_NOT_FOUND = 'Сообщение не найдено';
const MESSAGE_NO_EDIT_ACCESS = 'Нет прав на редактирование сообщения';
const MESSAGE_NO_DELETE_ACCESS = 'Нет прав на удаление сообщения';
const MESSAGE_CANNOT_BE_EMPTY = 'Сообщение не может быть пустым';

exports.forumsListPage = (req, res, next) => {
  Forum
    .find()
    .then(
      forums => {
        res.render(
          'forum/forums.hbs', {
            user: req.user,
            pageTitle: 'Форум',
            forums: forums,
            breadcrumbs: true
          })
      }
    )
    .catch(err => next(err));
}

exports.forumPage = (req, res, next) => {
  const page = req.query.page ? +req.query.page : 1;

  Promise.all([
      Forum.findOne({
        key: req.params.forum
      })
        .then(forum => forum.topics.length),
      Forum
        .findOne({
          key: req.params.forum
        })
        .populate({
          path: 'pinnedTopics',
          populate: {
            path: 'lastMessage'
          }
        })
        .populate({
          path: 'unpinnedTopics',
          options: {
            skip: (page - 1) * siteConfig.forum.topicsPerPage,
            limit: siteConfig.forum.topicsPerPage,
            populate: {
              path: 'lastMessage',
              populate: {
                path: 'author'
              }
            }
          }
        }),
      Forum.findOne({
        key: req.params.forum
      })
        .populate('pinnedTopics')
    ])
    .then(
      ([count, forum]) => {
        if (!forum) {
          const error = new Error(FORUM_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        res.render(
          'forum/forum.hbs', {
            user: req.user,
            pageTitle: forum.title,
            forum: forum,
            createTopicAccess: helpers.checkAccessByRole(req.user, ['forum', 'topics', 'create']),
            pagination: helpers.pagination({
              current: page,
              show: 2,
              perPage: siteConfig.forum.topicsPerPage,
              link: `/forum/${req.params.forum}?page=`,
              total: count
            }),
            breadcrumbs: [
              { link: '/forum', title: 'Форум' }
            ]
          })
      }
    )
    .catch(err => next(err));
}

exports.topicPage = (req, res, next) => {
  ForumTopic
    .findById(req.params.topicId)
    .then(topic => {
      if (!topic) {
        const error = new Error(TOPIC_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      const totalPages = Math.ceil(topic.messages.length / siteConfig.forum.messagesPerPage);
      return {
        totalItems: topic.messages.length,
        current: req.query.page ? req.query.page : totalPages
      }
    })
    .then(pagesData => {
      return ForumTopic
        .findById(req.params.topicId)
        .populate({
          path: 'messages',
          options: {
            skip: ((pagesData.current > 0 ? pagesData.current : 1) - 1) * siteConfig.forum.messagesPerPage,
            limit: siteConfig.forum.messagesPerPage,
            sort: 'createdAt'
          },
          populate: {
            path: 'author'
          }
        })
        .populate('forum')
        .then(
          topic => {
            const
              editTopicAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit'),
              deleteTopicAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'delete'),
              messages = topic.messages.map(
                message => {
                  const
                    editMessageAccess = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'edit'),
                    deleteMessageAccess = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'delete');
                  message.editUrl = editMessageAccess ? `${req.params.forum}/${req.params.topicId}/${message._id}/edit` : null
                  message.deleteUrl = deleteMessageAccess ? `/${req.params.forum}/${req.params.topicId}/${message._id}/delete` : null;
                  message.showControls = editMessageAccess || deleteMessageAccess;
                  return message;
                }
              );
            res.render(
              'forum/topic.hbs', {
                user: req.user,
                pageTitle: topic.title,
                topic: topic,
                messages: messages,
                forumMessageForm: {
                  url: `${req.params.forum}/${req.params.topicId}`
                },
                topicControls: editTopicAccess || deleteTopicAccess,
                editTopicUrl: editTopicAccess ? `${req.params.forum}/${req.params.topicId}/edit` : null,
                deleteTopicUrl: deleteTopicAccess ? `${req.params.forum}/${req.params.topicId}/delete` : null,
                pagination: helpers.pagination({
                  current: pagesData.current,
                  show: 2,
                  perPage: siteConfig.forum.messagesPerPage,
                  link: `/forum/${req.params.forum}/${req.params.topicId}?page=`,
                  total: pagesData.totalItems
                }),
                breadcrumbs: [
                  { title: 'Форум', link: '/forum' },
                  { title: topic.forum.title, link: `/forum/${topic.forum.key}` }
                ]
              })
          }
        )
    })
    .catch(err => next(err));
}

exports.createTopicPage = (req, res, next) => {
  Forum
    .findOne({
      key: req.params.forum
    })
    .then(forum => {
      if (!forum) {
        const error = new Error(FORUM_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      res.render(
        'forum/edit-topic.hbs', {
          user: req.user,
          pageTitle: 'Создать тему',
          editForm: {
            url: req.params.forum + '/create'
          },
          breadcrumbs: [
            { title: 'Форум', link: '/forum' },
            { title: forum.title, link: `/forum/${forum.key}`}
          ]
        });
    })
    .catch(err => next(err));
}

exports.editTopicPage = (req, res, next) => {
  ForumTopic
    .findById(req.params.topicId)
    .populate('forum')
    .then(topic => {
      if (!topic) {
        const error = new Error(TOPIC_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      const
        editAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit'),
        deleteAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'delete');

      if (!editAccess) {
        const error = new Error(TOPIC_NO_EDIT_ACCESS);
        error.status = 403;
        throw error;
      }

      res.render(
        'forum/edit-topic.hbs', {
          user: req.user,
          pageTitle: `Редактирование темы ${topic.title}`,
          editForm: {
            url: `${req.params.forum}/${req.params.topicId}/edit`,
            value: topic
          },
          deleteTopicUrl: deleteAccess ? `${req.params.forum}/${req.params.topicId}/delete` : null,
          breadcrumbs: [
            { title: 'Форум', link: '/forum' },
            { title: topic.forum.title, link: `/forum/${topic.forum.key}`}
          ]
        })
    })
    .catch(err => next(err));
}

exports.editMessagePage = (req, res, next) => {
  ForumMessage
    .findById(req.params.messageId)
    .populate({
      path: 'topic',
      populate: {
        path: 'forum'
      }
    })
    .then(message => {
      if (!message) {
        const error = new Error(MESSAGE_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      const editMessageAccess = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'edit');

      if (!editMessageAccess) {
        const error = new Error(MESSAGE_NO_EDIT_ACCESS);
        error.status = 403;
        throw error;
      }

      res.render('forum/edit-message.hbs', {
        user: req.user,
        pageTitle: 'Редактирование сообщения',
        editForm: {
          url: `${req.params.forum}/${req.params.topicId}/${req.params.messageId}/edit`,
          text: message.text
        },
        breadcrumbs: [
          { title: 'Форум', link: '/forum' },
          { title: message.topic.forum.title, link: `/forum/${message.topic.forum.key}` },
          { title: message.topic.title, link: `/forum/${message.topic.forum.key}/${message.topic._id}` }
        ]
      })
    })
    .catch(err => next(err));
}

exports.createTopic = (req, res, next) => {
  let msg;
  Forum.findOne({
      key: req.params.forum
    })
    .then(
      forum => {
        if (!forum) {
          const error = new Error(FORUM_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const text = req.body.message,
          title = req.body.title,
          description = req.body.description;

        let error;

        if (!text || !helpers.htmlToPlainText(text).length) {
          error = new Error(MESSAGE_CANNOT_BE_EMPTY);
        }

        if (!title || !title.length) {
          error = new Error(TOPIC_TITLE_CANNOT_BE_EMPTY);
        }

        if (!description || !description.length) {
          error = new Error(TOPIC_DESCRIPTION_CANNOT_BE_EMPTY);
        }

        if (error) {
          error.status = 422;
          throw error;
        }

        const newMessage = new ForumMessage({
          text: req.body.message,
          author: req.user.id
        });

        return newMessage.save()
          .then(
            message => {
              msg = message;
              const newTopic = new ForumTopic({
                title,
                description: description,
                pinned: helpers.checkBoxToBoolean(req.body.pinned),
                important: helpers.checkBoxToBoolean(req.body.important),
                author: req.user.id,
                messages: [message.id],
                forum: forum.id,
                lastMessage: message
              });
              return newTopic.save()
            }
          )
          .then(
            topic => {
              forum.topics.push(topic);
              msg.topic = topic._id;
              return Promise.all([
                forum.save(),
                msg.save()
              ])
            }
          )
      }
    ).then(
      () => res.redirect(`/forum/${req.params.forum}`)
    )
    .catch(err => next(err));
}

exports.updateTopic = (req, res, next) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        if (!topic) {
          const error = new Error(TOPIC_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const access = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit');

        if (!access) {
          const error = new Error(TOPIC_NO_EDIT_ACCESS);
          error.status = 403;
          throw error;
        }

        const title = req.body.title,
          description = req.body.description;

        let error;

        if (!title || !title.length) {
          error = new Error(TOPIC_TITLE_CANNOT_BE_EMPTY);
        }

        if (!description || !description.length) {
          error = new Error(TOPIC_DESCRIPTION_CANNOT_BE_EMPTY);
        }

        if (error) {
          error.status = 422;
          throw error;
        }

        req.body.important = helpers.checkBoxToBoolean(req.body.important);
        req.body.pinned = helpers.checkBoxToBoolean(req.body.pinned);

        topic.set(req.body);
        topic
          .save()
          .then(() => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`))
      }
    )
    .catch(err => next(err));
}

exports.deleteTopic = (req, res, next) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        if (!topic) {
          const error = new Error(TOPIC_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const access = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'delete');

        if (!access) {
          const error = new Error(TOPIC_NO_DELETE_ACCESS);
          error.status = 403;
          throw error;
        }

        topic
          .remove()
          .then(() => res.redirect(`/forum/${req.params.forum}`))
      }
    )
    .catch(err => next(err));
}

exports.createMessage = (req, res, next) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        if (!topic) {
          const error = new Error(TOPIC_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const newMessageBody = {
          text: req.body.text,
          topic: topic.id
        };

        if (req.user) {
          newMessageBody.author = req.user.id;
        } else {
          newMessageBody.authorName = req.body.authorName;
        }

        const newMessage = new ForumMessage(newMessageBody);

        return newMessage
          .save()
          .then(message => {
            topic.messages.push(message.id);
            return topic.save();
          })
          .then(() => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`));
      }
    )
    .catch(err => next(err));
}

exports.updateMessage = (req, res, next) => {
  ForumMessage
    .findById(req.params.messageId)
    .then(message => {
      if (!message) {
        const error = new Error(MESSAGE_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      const access = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'edit');

      if (!access) {
        const error = new Error(MESSAGE_NO_EDIT_ACCESS);
        error.status = 404;
        throw error;
      }

      if (!req.body.text || !helpers.htmlToPlainText(req.body.text).length) {
        const error = new Error(MESSAGE_CANNOT_BE_EMPTY);
        error.status = 422;
        throw error;
      }

      message.set(req.body);
      message.save().then(
        () => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`)
      );
    })
    .catch(err => next(err));
}

exports.deleteMessage = (req, res, next) => {
  ForumMessage
    .findById(req.params.messageId)
    .then(
      message => {
        if (!message) {
          const error = new Error(MESSAGE_NOT_FOUND);
          error.status = 404;
          throw error;
        }

        const access = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'delete');

        if (!access) {
          const error = new Error(MESSAGE_NO_DELETE_ACCESS);
          error.status = 403;
          throw error;
        }

        return message
          .remove()
          .then(
            () => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`)
          )
      }
    )
    .catch(err => next(err));
}

exports.newestMessagesPage = (req, res, next) => {
  ForumMessage
  .find()
  .sort('-createdAt')
  .limit(20)
  .populate('author')
  .populate({
    path: 'topic',
    populate: {
      path: 'forum'
    }
  })
  .then(messages => {
    res.render('forum/newest-messages', {
      user: req.user,
      pageTitle: 'Новые сообщения на форуме',
      messages: messages.map(message => {
        return {
          ...message,
          text: sanitizeHtml(message.text, {
            allowedTags: ['p', 'br']
          })
        };
      })
    });
  })
  .catch(err => next(err));
}