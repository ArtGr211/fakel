const mongoose = require('mongoose'),
  ForumTopicSchema = new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true
    },
    desciprion: {
      type: String,
      trim: true
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumMessage'
    }],
    pinned: {
      type: Boolean,
      default: false
    },
    important: {
      type: Boolean,
      default: false
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });

const ForumTopic = mongoose.model('ForumTopic', ForumTopicSchema);
module.exports = ForumTopic;