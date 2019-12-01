var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');
var tasksRouter = require('./routes/tasks');
var conversations = require('./routes/conversations');
var statusRouter = require('./routes/status');
var workspaceRouter = require('./routes/workspaces');
var conversationsRouter = conversations.router;

require('./models/bddconnect');
var session = require('express-session');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(
  session({
    secret: 'a4f8071f-c873-4447-8ee2',
    resave: false,
    saveUninitialized: false
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);
app.use('/conversations', conversationsRouter);
app.use('/status', statusRouter);
app.use('/workspace', workspaceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
