const
  siteConfig = require('../config/site'),
  Forum = require('../model/forum/forum.model'),
  ForumTopic = require('../model/forum/forum-topic.model'),
  ForumMessage = require('../model/forum/forum-message.model'),
  helpers = require('../utils/helpers');

exports.forumsListPage = (req, res, next) => {
  Forum
    .find()
    .then(
      forums => {
        res.render(
          'forum/forums.hbs', {
            user: req.user,
            pageTitle: 'Форум',
            forums: forums
          })
      }
    )
    .catch(e => next())
}

exports.forumPage = (req, res, next) => {
  const page = req.query.page ? +req.query.page : 1;

  Promise.all([
      Forum.findOne({
        key: req.params.forum
      }).then(forum => forum.topics.length),
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
            })
          })
      }
    )
    .catch(e => next())
}

exports.topicPage = (req, res, next) => {
  ForumTopic
    .findById(req.params.topicId)
    .then(topic => {
      const totalPages = Math.ceil(topic.messages.length / siteConfig.forum.messagesPerPage);
      return {
        totalItems: topic.messages.length,
        current: req.query.page ? req.query.page : totalPages
      }
    })
    .then(pagesData => {
      return ForumTopic.findById(req.params.topicId)
        .populate({
          path: 'messages',
          options: {
            skip: ((pagesData.current > 0 ? pagesData.current : 1) - 1) * siteConfig.forum.topicsPerPage,
            limit: siteConfig.forum.topicsPerPage,
            sort: 'createdAt'
          },
          populate: {
            path: 'author'
          }
        })
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
                })
              })
          }
        )
    })
    .catch(e => next())
}

exports.createTopicPage = (req, res) => {
  res.render(
    'forum/edit-topic.hbs', {
      user: req.user,
      pageTitle: 'Создать тему',
      editForm: {
        url: req.params.forum + '/create'
      }
    })
}

exports.editTopicPage = (req, res, next) => {
  ForumTopic
    .findById(req.params.topicId)
    .then(topic => {
      const
        editAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit'),
        deleteAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'delete');
      if (!editAccess) {
        next({
          status: 403
        });
      } else {
        res.render(
          'forum/edit-topic.hbs', {
            user: req.user,
            pageTitle: `Редактирование темы ${topic.title}`,
            editForm: {
              url: `${req.params.forum}/${req.params.topicId}/edit`,
              value: topic
            },
            deleteTopicUrl: deleteAccess ? `${req.params.forum}/${req.params.topicId}/delete` : null
          })
      }
    })
    .catch(e => next())
}

exports.editMessagePage = (req, res, next) => {
  ForumMessage
    .findById(req.params.messageId)
    .then(message => {
      const editMessageAccess = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'edit');
      if (editMessageAccess) {
        res.render('forum/edit-message.hbs', {
          user: req.user,
          pageTitle: 'Редактирование сообщения',
          editForm: {
            url: `${req.params.forum}/${req.params.topicId}/${req.params.messageId}/edit`,
            text: message.text
          }
        })
      } else {
        next({
          status: 403
        });
      }
    })
    .catch(e => next())
}

exports.createTopic = (req, res, next) => {
  let msg;
  Forum.findOne({
      key: req.params.forum
    })
    .then(
      forum => {
        const newMessage = new ForumMessage({
          text: req.body.message,
          author: req.user.id
        });

        return newMessage.save()
          .then(
            message => {
              msg = message;
              const newTopic = new ForumTopic({
                title: req.body.title,
                description: req.body.description,
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
    .catch(e => next())
}

exports.updateTopic = (req, res, next) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        const access = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit');
        req.body.important = helpers.checkBoxToBoolean(req.body.important);
        req.body.pinned = helpers.checkBoxToBoolean(req.body.pinned);
        if (access) {
          topic.set(req.body);
          topic
            .save()
            .then(() => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`))
        } else {
          next({
            status: 403
          });
        }
      }
    )
    .catch(e => next())
}

exports.deleteTopic = (req, res, next) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        const access = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'delete');
        if (access) {
          topic
            .remove()
            .then(() => res.redirect(`/forum/${req.params.forum}`))
        } else {
          next({
            status: 403
          });
        }
      }
    )
    .catch(e => next())
}

exports.createMessage = (req, res, next) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
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

        newMessage
          .save()
          .then(message => {
            topic.messages.push(message.id);
            return topic.save();
          })
          .then(() => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`));
      }
    )
    .catch(e => next())
}

exports.updateMessage = (req, res, next) => {
  ForumMessage
    .findById(req.params.messageId)
    .then(message => {
      const access = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'edit');
      if (access) {
        message.set(req.body);
        message.save().then(
          () => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`)
        );
      } else {
        next({
          status: 403
        });
      }
    })
    .catch(e => next())
}

exports.deleteMessage = (req, res, next) => {
  ForumMessage
    .findById(req.params.messageId)
    .then(
      message => {
        const access = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'delete');
        if (access) {
          message
            .remove()
            .then(
              () => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`)
            )
        } else {
          next({
            status: 403
          });
        }
      }
    )
    .catch(e => next())
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
      messages
    });
  })
}