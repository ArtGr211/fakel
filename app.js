const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  mongoose = require('mongoose'),
  config = require('./config/dev.config'),
  path = require('path'),
  MongoDBStore = require('connect-mongodb-session')(session),
  hbs = require('hbs'),
  HandlebarsMoment = require('handlebars.moment'),
  app = express();

global.__basedir = __dirname;

HandlebarsMoment.registerHelpers(hbs.handlebars);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/fdb',
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
require('./view/forum/forum')();
require('./view/user/user')();

app.use(require('./middlewares/user'));
app.use('/', require('./routes/main'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/blog', require('./routes/blog'));
app.use('/forum', require('./routes/forum'));
app.use('/user', require('./routes/user'));
app.get('/*.html', require('./controller/static').staticPage);
app.use('', (req, res, next) => {
  next({
    status: 404
  })
})
app.use(require('./controller/errors').errorPage);

app.listen(3000, function () {
  console.log('App is running and listening on port 3000')
});