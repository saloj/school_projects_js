const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');

const postsRouter = require('./controllers/posts');
const loginRouter = require('./controllers/login');
const commentsRouter = require('./controllers/comments');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.jwtTokenExtractor);

app.use('/login', loginRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
