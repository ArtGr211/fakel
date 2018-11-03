const route = '/sign-up',
  controller = require('../controller/sign-up');

module.exports = (app) => {
  app.get(route, controller.signUp);

  app.post(route, controller.registerUser);
}