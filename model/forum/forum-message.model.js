const mongoose = require('mongoose'),
  ForumMessageSchema = new mongoose.Schema({
    text: {
      type: String,
      trim: true,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: {
      type: String
    }
  }, {
    timestamps: true
  });

const ForumMessage = mongoose.model('ForumMessage', ForumMessageSchema);

module.exports = ForumMessage;