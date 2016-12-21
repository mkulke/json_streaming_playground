'use strict';
const express = require('express');
const Promise = require('bluebird');
const app = express();

function produce(name) {
  if (typeof name === 'number') {
    return Promise.reject('numbers not allowed');
  }
  return Promise.delay(500, { hello: name });
}

app.get('/', (req, res) => {
  res.type('json');

  res.write('[');
  const circular = {};
  circular.circular = circular;
  Promise.mapSeries(['world', 'mundo', 5, 'welt', circular], (name, index) => {
    const separator = index === 0 ? '' : ',';
    return produce(name)
    .tap(obj => res.write(separator + JSON.stringify(obj)))
    .catch(console.error);
  })
    .finally(() => {
      res.write(']');
      res.end();
    });
});

app.listen(3000, () => {
  console.log('Streaming answers on port 3000');
});
