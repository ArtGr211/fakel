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
        case 11000:
          next({
            status: 422,
            description: 'Пользователь с таким username или email уже зарегистрирован'
          })
          break;
        default:
          next({
            status: 500,
            description: 'Ошибка регистрации'
          })
          break;
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
        next({
          status: 401,
          description: 'Неправильный email или пароль'
        })
      }
    })
    .catch(err => next())
}

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}