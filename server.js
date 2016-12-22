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

class Writer {
  constructor(writable) {
    this.writable = writable;
    this.index = 0;
  }

  open() {
    this.writable.write(HEAD);
  }

  write(obj) {
    const separator = this.index++ === 0 ? '' : SEPARATOR;
    this.writable.write(separator + JSON.stringify(obj));
  }

  close() {
    this.writable.write(TAIL);
  }
}

app.get('/', (req, res) => {
  res.type('json');
  const writer = new Writer(res);
  writer.open();
  Promise.map(['world', 'mundo', 5, 'mun', 'welt'], word => {
    return produce(word)
      .tap(obj => writer.write(obj))
      .catch(console.error);
  })
    .finally(() => {
      writer.close();
      res.end();
    });
});

app.listen(3000, () => {
  console.log('Streaming answers on port 3000');
});
