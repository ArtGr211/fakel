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
  const title = `Ошибка${err.status ? ' ' + err.status : ''}`;
  let description;
  if (err.description) {
    description = err.description;
  } else {
    switch (err.status) {
      case 401:
        description = 'Ошибка авторизации';
        break;
      case 403:
        description = 'Доступ к запрашиваемой странице запрещен';
        break;
      case 404:
        description = 'Страница не найдена';
        break;
      case 422:
        description = 'Данные в некорректном формате';
        break;
      case 500:
        description = 'Внутреняя ошибка сервера';
        break;
      default:
        description = 'Ошибка';
        break;
    }
  }
  res
    .status(err.status ? err.status : 500)
    .render('errors/error', {
      pageTitle: title,
      error: {
        title: title,
        description: description
      }
    })
}