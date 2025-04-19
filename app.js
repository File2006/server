const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', indexRouter);
module.exports = app;
