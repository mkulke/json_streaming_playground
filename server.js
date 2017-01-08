'use strict';
const express = require('express');
const jsonStream = require('./jsonStream');
const service = require('./service');
const app = express();

const WORDS = ['world', 'mundo', 'heimurinn', 5, 'mun', 'welt', 'wereld'];

app.get('/api', jsonStream, (req, res) => {
  const statements$ = service.getStatements(WORDS);
  res.stream(statements$);
});

app.use('/client', express.static('public'));
app.use('/client', express.static('node_modules/oboe/dist'));
app.use('/client', express.static('node_modules/d3/build'));

app.listen(3000, () => {
  console.log('Streaming answers on port 3000');
});
