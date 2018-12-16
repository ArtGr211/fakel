const mongoose = require('mongoose'),
  helpers = require('../../utils/helpers'),
  ForumTopicSchema = new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true
    },
    descriprion: {
      type: String,
      trim: true
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

const ForumTopic = mongoose.model('ForumTopic', ForumTopicSchema);
module.exports = ForumTopic;