const
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
  Forum
    .findOne({
      key: req.params.forum
    })
    .populate('topics')
    .then(
      forum => {
        res.send(
          templateUtils.renderTemplate('forum/forum', {
            user: req.user,
            pageTitle: forum.title,
            forum: forum
          })
        )
      }
    )
}

exports.topicPage = (req, res) => {
  ForumTopic.findById(req.params.topicId)
    .populate({
      path: 'messages',
      populate: {
        path: 'author'
      }
    })
    .then(
      topic => {
        const editTopicAccess = helpers.authorEditAccess(topic, req.user, ['forum', 'editAllTopics']),
          messages = topic.messages.map(
            message => {
              const editMessageAccess = helpers.authorEditAccess(message, req.user, ['forum', 'editAllMessages']);
              message.editUrl = editMessageAccess ? `/${req.params.forum}/${req.params.topicId}/${message._id}/edit` : null
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
              url: `/forum/${req.params.forum}/${req.params.topicId}`
            },
            editTopicUrl: editTopicAccess ? `/forum/${req.params.forum}/${req.params.topicId}/edit` : null
          })
        )
      }
    )
}

exports.editForumPage = (req, res) => {
  if (req.params.forum) {
    // send data to edit
  } else {
    res.send(
      templateUtils.renderTemplate('forum/edit-forum', {
        user: req.user,
        pageTitle: 'Create forum',
        formUrl: 'create'
      })
    )
  }
}

exports.editTopicPage = (req, res) => {
  if (req.params.topicId) {
    ForumTopic
      .findById(req.params.topicId)
      .then(topic => {
        const editAccess = helpers.authorEditAccess(topic, req.user, ['forum', 'editAllTopics']);
        if (!editAccess) {
          res.sendStatus(403);
        } else {
          res.send(
            templateUtils.renderTemplate('forum/edit-topic', {
              user: req.user,
              pageTitle: `Edit topic ${topic.title}`,
              formUrl: `${req.params.forum}/${req.params.topicId}/edit`,
              formValue: topic
            })
          )
        }
      })
  } else {
    res.send(
      templateUtils.renderTemplate('forum/edit-topic', {
        user: req.user,
        pageTitle: 'Create topic',
        formUrl: req.params.forum + '/create'
      })
    )
  }
}

exports.editMessagePage = (req, res) => {

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

exports.updateForum = (req, res) => {

}

exports.deleteForum = (req, res) => {

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
        const access = helpers.authorEditAccess(topic, req.user, ['forum', 'editAllTopics']);
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

}

exports.deleteMessage = (req, res) => {

}