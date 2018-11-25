const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      default: 'user'
    }
  }, {
    timestamps: true
  })
UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  })
})

UserSchema.static('auth', function (email, password, callback) {
  this.findOne({
      email: email
    })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        const err = new Error('User not found');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) {
          return callback(null, user);
        }
        return callback();
      })
    })
})

UserSchema.static('findBySession', function (req) {
  return this.findById(req.session.userId);
})

const User = mongoose.model('User', UserSchema);

module.exports = User;