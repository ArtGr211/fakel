const templateUtil = require('../utils/template'),
  User = require('../model/user.model');

exports.registrationPage = (req, res) => {
  res.render('auth/registration.hbs', {
    pageTitle: 'Sign up',
    user: req.user,
    loginForm: {
      url: '/auth/registration'
    }
  })
}

exports.loginPage = (req, res) => {
  res.render('auth/login.hbs', {
    pageTitle: 'Sign in',
    user: req.user,
    registrationForm: {
      url: '/auth/login'
    }
  })
}

exports.registration = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  newUser.save()
    .then((user) =>
      res.redirect('/sign-in')
    )
    .catch(e => res.render('errors/error.hbs', {
      pageTitle: 'Error',
      user: req.user
    }))
}

exports.login = (req, res) => {
  User.auth(
    req.body.email,
    req.body.password,
    (err, user) => {
      if (err) {
        res.render('errors/error.hbs', {
          pageTitle: 'Error',
          user: req.user
        })
      } else if (user) {
        req.session.userId = user._id;
        res.redirect('/')
      }
    }
  )
}

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}