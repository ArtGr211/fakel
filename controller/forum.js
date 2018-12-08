const
  Forum = require('../model/forum/forum.model'),
  ForumTopic = require('../model/forum/forum-topic.model'),
  ForumMessage = require('../model/forum/forum-message.model'),
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
        res.send(
          templateUtils.renderTemplate('forum/topic', {
            user: req.user,
            topic: topic,
            pageTitle: topic.title,
            forumMessageForm: {
              url: `/forum/${req.params.forum}/${req.params.topicId}`
            }
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
  if (req.params.topic) {
    // send data to edit
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