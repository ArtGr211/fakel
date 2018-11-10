const route = '/sign-in',
  controller = require('../controller/sign-in');

module.exports = (app) => {
  app.get(route, controller.form);

  app.post(route, controller.login);
}