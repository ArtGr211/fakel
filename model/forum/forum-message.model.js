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
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumTopic'
    },
    authorName: {
      type: String
    }
  }, {
    timestamps: true
  });

ForumMessageSchema.pre('remove', function () {
  this
    .model('ForumTopic')
    .findById(this.topic)
    .then(topic => {
      topic.messages = topic.messages.filter(id => id != this.id);
      return topic.save();
    })
})

const ForumMessage = mongoose.model('ForumMessage', ForumMessageSchema);

module.exports = ForumMessage;