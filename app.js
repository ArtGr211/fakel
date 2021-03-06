const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  mongoose = require('mongoose'),
  config = require('./config/config'),
  path = require('path'),
  MongoDBStore = require('connect-mongodb-session')(session),
  hbs = require('hbs'),
  HandlebarsMoment = require('handlebars.moment'),
  app = express(),
  port = process.env.PORT || 3000;

global.__basedir = __dirname;

HandlebarsMoment.registerHelpers(hbs.handlebars);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const store = new MongoDBStore({
  uri: config.db.url,
  collection: 'sessions'
})
app.use(session({
  key: 'user_sid',
  secret: 'Hello, world!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    express: 60000
  },
  store: store
}));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/libs/normalize.css', express.static(path.join(__dirname, 'node_modules', 'normalize.css')));
app.use('/libs/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/libs/trumbowyg', express.static(path.join(__dirname, 'node_modules', 'trumbowyg', 'dist')));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/view/');

mongoose.connect(config.db.url, {
  useNewUrlParser: true
}).then(
  () => console.log('Successfully connected to database')
).catch(
  () => {
    console.log('Database connecting error');
    process.exit();
  }
)

require('./view/_layout/layout')();
require('./view/widgets/comments/comments')();
require('./view/widgets/pagination/pagination')();
require('./view/widgets/breadcrumbs/breadcrumbs')();
require('./view/forum/forum')();
require('./view/user/user')();

app.use(require('./middlewares/user'));
app.use('/', require('./routes/blog'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/forum', require('./routes/forum'));
app.use('/user', require('./routes/user'));
app.get('/*.html', require('./controller/static').staticPage);
app.use('', (req, res, next) => {
  next({
    status: 404
  })
});
app.use(require('./controller/errors').errorPage);

app.listen(port, function () {
  console.log(`App is running and listening on port ${port}`)
});