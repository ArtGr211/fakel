const mongoose = require('mongoose'),
  helpers = require('../../utils/helpers'),
  ForumTopicSchema = new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    forum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Forum',
      required: true
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumMessage'
    }],
    pinned: {
      type: Boolean,
      default: false,
      set: helpers.checkBoxToBoolean
    },
    important: {
      type: Boolean,
      default: false,
      set: helpers.checkBoxToBoolean
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });

ForumTopicSchema.pre('save', function (next) {
  if (this.isModified('pinned')) {
    this.model('Forum')
      .findOne({
        _id: this.forum
      })
      .then(forum => {
        if (this.pinned) {
          forum.pinnedTopics.push(this._id);
          forum.unpinnedTopics = forum.unpinnedTopics
            .filter(id => id.toString() != this._id.toString());
        } else {
          forum.unpinnedTopics.push(this._id);
          forum.pinnedTopics = forum.pinnedTopics
            .filter(id => id.toString() != this._id.toString());
        }
        return forum.save();
      })
      .then(() => next());
  } else {
    next();
  }
})

ForumTopicSchema.pre('remove', function () {
  this.model('Forum')
    .findById(this.forum)
    .then(forum => {
      forum.topics = forum.topics.filter(id => id != this.id);
      forum.pinnedTopics = forum.pinnedTopics.filter(id => id != this.id);
      forum.unpinnedTopics = forum.unpinnedTopics.filter(id => id != this.id);
      return forum.save();
    })
  this.messages.forEach(messageId => {
    this
      .model('ForumMessage')
      .findByIdAndRemove(messageId)
      .exec()
  })
})

const ForumTopic = mongoose.model('ForumTopic', ForumTopicSchema);
module.exports = ForumTopic;