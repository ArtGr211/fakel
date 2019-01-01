const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  mongoose = require('mongoose'),
  config = require('./config/dev.config'),
  app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: 'Hello, world!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    express: 60000
  }
}));

app.use('/assets', express.static(__dirname + '/assets'));

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
app.use(require('./middlewares/user'));
app.use('/', require('./routes/main'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/blog', require('./routes/blog'));
app.use('/forum', require('./routes/forum'));

app.listen(3000, function () {
  console.log('App is running and listening on port 3000')
});