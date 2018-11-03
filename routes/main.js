const route = '',
controller = require('../controller/main');

module.exports = (app) => {
  app.get(route, controller.mainPage)
}