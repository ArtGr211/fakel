const mongoose = require('mongoose'),
  sanitizeHtml = require('sanitize-html'),
  sanitizeConfig = require('../config/sanitize'),
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
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'subjectModel'
    },
    subjectModel: {
      type: String,
      required: true,
      enum: ['Article']
    }
  }, {
    timestamps: true
  });

CommentSchema.pre('save', function () {
  if (this.isModified('text')) {
    this.text = sanitizeHtml(
      this.text,
      sanitizeConfig.options
    );
  }
})

CommentSchema.pre('remove', function () {
  this.model(this.subjectModel)
    .findById(this.subject)
    .then(subject => {
      subject.comments = subject.comments.filter(id => id != this.id);
      return subject.save();  
    })
})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;