const express = require('express')
const app = express();
const morgan = require('morgan');
const cors = require('cors');
app.use(morgan('dev'));
app.use(cors())

// settings
app.set('port', process.env.PORT || 4000);

app.use(require('./routes/index'))
module.exports = app;