const db = process.env.DB || 'mongodb://localhost:27017/fdb';

module.exports = {
  db: {
    url: db
  }
}