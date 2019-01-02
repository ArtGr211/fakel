const mongoose = require('mongoose'),
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
    }]
  }, {
    timestamps: true
  })

ArticleSchema.pre('remove', function () {
  this.comments.forEach(commentId => {
    this.model('Comment').findByIdAndRemove(commentId).exec();
  })
})

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;