const mongoose = require('mongoose'),
  ForumSchema = new mongoose.Schema({
    key: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    title: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    topics: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumTopic'
    }],
    unpinnedTopics: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumTopic'
    }],
    pinnedTopics: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumTopic'
    }]
  });

const Forum = mongoose.model('Forum', ForumSchema);

module.exports = Forum;