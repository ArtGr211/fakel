const
  siteConfig = require('../config/site'),
  Forum = require('../model/forum/forum.model'),
  ForumTopic = require('../model/forum/forum-topic.model'),
  ForumMessage = require('../model/forum/forum-message.model'),
  helpers = require('../utils/helpers'),
  templateUtils = require('../utils/template');

exports.forumsListPage = (req, res) => {
  Forum
    .find()
    .then(
      forums => {
        res.send(
          templateUtils.renderTemplate('forum/forums', {
            user: req.user,
            pageTitle: 'Forum',
            forums: forums
          })
        )
      }
    )
}

exports.forumPage = (req, res) => {
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
        path: 'topics',
        options: {
          skip: (page - 1) * siteConfig.forum.topicsPerPage,
          limit: siteConfig.forum.topicsPerPage
        }
      })
    ])
    .then(
      data => {
        const
          count = data[0],
          forum = data[1];
        res.send(
          templateUtils.renderTemplate('forum/forum', {
            user: req.user,
            pageTitle: forum.title,
            forum: forum,
            createTopicAccess: helpers.checkAccessByRole(req.user, ['forum', 'topics', 'create']),
            pagination: helpers.pagination({
              current: page,
              show: 2,
              link: `/forum/${req.params.forum}?page=`,
              total: Math.floor(count / siteConfig.forum.topicsPerPage)
            })
          })
        )
      }
    )
}

exports.topicPage = (req, res) => {
  ForumTopic
    .findById(req.params.topicId)
    .then(topic => {
      const total = Math.floor(topic.messages.length / siteConfig.forum.topicsPerPage);
      return {
        total: total,
        current: req.query.page ? req.query.page : total
      }
    })
    .then(pagesData => {
      return ForumTopic.findById(req.params.topicId)
        .populate({
          path: 'messages',
          options: {
            skip: ((pagesData.current > 0 ? pagesData.current : 1) - 1) * siteConfig.forum.topicsPerPage,
            limit: siteConfig.forum.topicsPerPage,
            sort: '-createdAt'
          },
          populate: {
            path: 'author'
          }
        })
        .then(
          topic => {
            const
              editTopicAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit'),
              messages = topic.messages.map(
                message => {
                  const
                    editMessageAccess = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'edit'),
                    deleteMessageAccess = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'delete');
                  message.editUrl = editMessageAccess ? `/${req.params.forum}/${req.params.topicId}/${message._id}/edit` : null
                  message.deleteUrl = deleteMessageAccess ? `/${req.params.forum}/${req.params.topicId}/${message._id}/delete` : null;
                  return message;
                }
              );
            res.send(
              templateUtils.renderTemplate('forum/topic', {
                user: req.user,
                pageTitle: topic.title,
                topic: topic,
                messages: messages,
                forumMessageForm: {
                  url: `${req.params.forum}/${req.params.topicId}`
                },
                editTopicUrl: editTopicAccess ? `${req.params.forum}/${req.params.topicId}/edit` : null,
                deleteTopicUrl: editTopicAccess ? `${req.params.forum}/${req.params.topicId}/delete` : null,
                pagination: helpers.pagination({
                  current: pagesData.current,
                  show: 2,
                  link: `/forum/${req.params.forum}/${req.params.topicId}?page=`,
                  total: pagesData.total
                })
              })
            )
          }
        )
    })
}

exports.editForumPage = (req, res) => {
  res.send(
    templateUtils.renderTemplate('forum/edit-forum', {
      user: req.user,
      pageTitle: 'Create forum',
      formUrl: 'create'
    })
  )
}

exports.createTopicPage = (req, res) => {
  res.send(
    templateUtils.renderTemplate('forum/edit-topic', {
      user: req.user,
      pageTitle: 'Create topic',
      editForm: {
        url: req.params.forum + '/create'
      }
    })
  )
}

exports.editTopicPage = (req, res) => {
  ForumTopic
    .findById(req.params.topicId)
    .then(topic => {
      const
        editAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit'),
        deleteAccess = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'delete');
      if (!editAccess) {
        res.sendStatus(403);
      } else {
        res.send(
          templateUtils.renderTemplate('forum/edit-topic', {
            user: req.user,
            pageTitle: `Edit topic ${topic.title}`,
            editForm: {
              url: `${req.params.forum}/${req.params.topicId}/edit`,
              value: topic
            },
            deleteTopicUrl: deleteAccess ? `${req.params.forum}/${req.params.topicId}/delete` : null
          })
        )
      }
    })
}

exports.editMessagePage = (req, res) => {
  ForumMessage
    .findById(req.params.messageId)
    .then(message => {
      const editMessageAccess = helpers.authorAccess(message, req.user, ['forum', 'messages'], 'edit');
      if (editMessageAccess) {
        res.send(templateUtils.renderTemplate('forum/edit-message', {
          user: req.user,
          pageTitle: 'Edit message',
          editForm: {
            url: `${req.params.forum}/${req.params.topicId}/${req.params.messageId}/edit`,
            text: message.text
          }
        }))
      } else {
        res.sendStatus(403);
      }
    })
}

exports.createForum = (req, res) => {
  const newForum = new Forum({
    title: req.body.title,
    key: req.body.key,
    description: req.body.description
  });
  newForum.save()
    .then(forum => {
      res.redirect(`/forum/${forum.key}`);
    })
}

exports.createTopic = (req, res) => {
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
              const newTopic = new ForumTopic({
                title: req.body.title,
                description: req.body.description,
                pinned: req.body.pinned ? true : false,
                important: req.body.important ? true : false,
                author: req.user.id,
                messages: [message.id]
              });
              return newTopic.save()
            }
          )
          .then(
            topic => {
              forum.topics.push(topic);
              return forum.save();
            }
          )
      }
    ).then(
      () => res.redirect(`/forum/${req.params.forum}`)
    )
}

exports.updateTopic = (req, res) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        const access = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'edit');
        if (access) {
          topic.set(req.body);
          topic
            .save()
            .then(() => res.redirect(`/forum/${req.params.forum}/${req.params.topicId}`))
        } else {
          res.sendStatus(403);
        }
      }
    )
}

exports.deleteTopic = (req, res) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        const access = helpers.authorAccess(topic, req.user, ['forum', 'topics'], 'delete');
        if (access) {
          topic
            .remove()
            .then(() => res.redirect(`/forum/${req.params.forum}`))
        } else {
          res.sendStatus(403);
        }
      }
    )
}

exports.createMessage = (req, res) => {
  ForumTopic.findById(req.params.topicId)
    .then(
      topic => {
        const newMessageBody = {
          text: req.body.text
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
}

exports.updateMessage = (req, res) => {
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
        res.sendStatus(403);
      }
    })
}

exports.deleteMessage = (req, res) => {
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
          res.sendStatus(403);
        }
      }
    )
}