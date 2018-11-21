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
app.use(require('./middlewares/user'));
app.use('/', require('./routes/main'));
app.use('/sign-up', require('./routes/sign-up'));
app.use('/sign-in', require('./routes/sign-in'));
app.use('/profile', require('./routes/profile'));
app.use('/blog', require('./routes/blog'));

app.listen(3000, function () {
  console.log('App is running and listening on port 3000')
});