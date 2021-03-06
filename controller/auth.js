const User = require('../model/user.model');

exports.registrationPage = (req, res) => {
  res.render('auth/registration.hbs', {
    pageTitle: 'Регистрация',
    user: req.user,
    loginForm: {
      url: '/auth/registration'
    },
    breadcrumbs: true
  })
}

exports.loginPage = (req, res) => {
  res.render('auth/login.hbs', {
    pageTitle: 'Логин',
    user: req.user,
    registrationForm: {
      url: '/auth/login'
    },
    breadcrumbs: true
  })
}

exports.registration = (req, res, next) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  newUser.save()
    .then((user) =>
      res.redirect('/auth/login')
    )
    .catch(err => {
      switch (err.code) {
        case 11000: {
          const error = new Error('Пользователь с таким username или email уже зарегистрирован')
          error.status = 422;
          return next(error);
        }
        default: {
          const error = new Error(err);
          return next(error);
        }
      }
    })
}

exports.login = (req, res, next) => {
  User.auth(
      req.body.email,
      req.body.password
    ).then(user => {
      if (user) {
        req.session.userId = user._id;
        res.redirect('/')
      } else {
        const error = new Error('Неправильный email или пароль');
        error.status = 401;
        throw error;
      }
    })
    .catch(err => next(err))
}

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}