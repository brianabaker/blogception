const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const blogRouter = require('./routes/blogRouter');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/', blogRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});