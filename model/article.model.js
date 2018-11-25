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
    }
  }, {
    timestamps: true
  })

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;