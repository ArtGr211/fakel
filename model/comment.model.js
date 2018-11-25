const mongoose = require('mongoose'),
  CommentSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
      trim: true
    },
    authorName: {
      type: String,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }, {
    timestamps: true
  });

module.exports = CommentSchema;