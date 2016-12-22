'use strict';
const express = require('express');
const Promise = require('bluebird');
const app = express();

const HEAD = '[';
const SEPARATOR = ',';
const TAIL = ']';

function produce(word) {
  if (typeof word !== 'string') {
    return Promise.reject('not a string');
  }
  return Promise.delay(100 * word.length, { hello: word });
}

app.get('/', (req, res) => {
  res.type('json');
  res.write(HEAD);
  let index = 0;
  Promise.map(['world', 'mundo', 5, 'mun', 'welt'], word => {
    return produce(word)
      .tap(obj => {
        const separator = index++ === 0 ? '' : SEPARATOR;
        res.write(separator + JSON.stringify(obj));
      })
      .catch(console.error);
  })
    .finally(() => {
      res.write(TAIL);
      res.end();
    });
});

app.listen(3000, () => {
  console.log('Streaming answers on port 3000');
});
