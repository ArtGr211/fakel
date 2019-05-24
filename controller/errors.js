exports.pageNotFound = (req, res) => {
  res.render('errors/not-found', {
    pageTitle: '404 - страница не найдена'
  });
}

exports.internalError = (req, res) => {
  res.render('errors/internal-error', {
    pageTitle: '500 - внутренняя ошибка сервера'
  });
}

exports.errorPage = (err, req, res, next) => {
  console.log(err);

  if (err.name === 'ValidationError') {
    err.status = 422;
    err.message = 'Ошибка валидации';
  }

  if (!err.status) {
    err.status = 500;
    err.message = 'Ошибка сервера';
  }

  const title = `Ошибка ${err.status}`;
  res
    .status(err.status ? err.status : 500)
    .render('errors/error', {
      pageTitle: title,
      user: req.user,
      error: {
        title: title,
        description: err.message
      }
    })
}