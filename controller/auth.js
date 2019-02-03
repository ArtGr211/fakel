const User = require('../model/user.model');

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
      pageTitle: 'Ошибка авторизации',
      user: req.user,
      error: {
        title: 'Ошибка авторизации',
        description: 'Неверный email или пароль'
      }
    }))
}

exports.login = (req, res, next) => {
  User.auth(
    req.body.email,
    req.body.password,
    (err, user) => {
      if (err) {
        next({
          status: 401,
          description: 'Неправильный email или пароль'
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