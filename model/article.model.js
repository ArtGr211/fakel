const mongoose = require('mongoose'),
  sanitizeHtml = require('sanitize-html'),
  ArticleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    published: {
      type: Boolean,
      default: true
    },
    publishAt: {
      type: Date,
      default: function() {
        return this.createdAt;
      }
    }
  }, {
    timestamps: true
  })

ArticleSchema.pre('save', function() {
  if (this.isModified('text')) {
    this.text = sanitizeHtml(
      this.text,
      {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }
    );
  }
})

ArticleSchema.pre('remove', function () {
  this.comments.forEach(commentId => {
    this.model('Comment').findByIdAndRemove(commentId).exec();
  })
})

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;