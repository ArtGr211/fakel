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
    },
    avatarUrl: {
      type: String
    },
    birthdate: {
      type: Date
    },
    bio: {
      type: String
    },
    forumSignature: {
      type: String
    },
    status: {
      type: String
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

UserSchema.static('auth', function (email, password) {
  return this.findOne({
      email: email
    })
    .exec()
    .then(user => {
      if (!user) {
        return null;
      }
      return bcrypt.compare(password, user.password)
        .then(result => {
          if (result === true) return user;
        })
    })
})

UserSchema.static('findBySession', function (req) {
  return this.findById(req.session.userId);
})

const User = mongoose.model('User', UserSchema);

module.exports = User;