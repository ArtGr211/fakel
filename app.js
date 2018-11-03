const express = require('express'),
  bodyParser = require('body-parser'),
  app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const routes = [
  'main',
  'sign-up'
];

routes.forEach(route => {
  require(`./routes/${route}`)(app)
});

app.listen(3000, function () {
  console.log('App is running and listening on port 3000')
});