'use strict';
const express = require('express');
// const Promise = require('bluebird');
const service = require('./service');
const app = express();

const HEAD = '[';
const SEPARATOR = ',';
const TAIL = ']';
const WORDS = ['world', 'mundo', 5, 'mun', 'welt'];

function buildArrayWriter(res) {
  let index = 0;
  res.type('json');

  return {
    open() {
      res.write(HEAD);
    },
    write(obj) {
      const separator = index++ === 0 ? '' : SEPARATOR;
      res.write(separator + JSON.stringify(obj));
    },
    close() {
      res.write(TAIL);
      res.end();
    },
  };
}

app.get('/', (req, res) => {
  const writer = new buildArrayWriter(res);
  writer.open();
  const observable = service.getStatements(WORDS);
  observable.subscribe(...[
    value => writer.write(value),
    err => console.error(err),
    () => writer.close(),
  ]);
});

app.listen(3000, () => {
  console.log('Streaming answers on port 3000');
});
