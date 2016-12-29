'use strict';
const express = require('express');
const service = require('./service');
const Rx = require('rxjs/Rx');
const app = express();

const HEAD = '[';
const SEPARATOR = ',';
const TAIL = ']';
const WORDS = ['world', 'mundo', 'heimurinn', 5, 'mun', 'welt', 'wereld'];

function _toChunk(statement, index) {
  const separator = index === 0 ? '' : SEPARATOR;
  return separator + JSON.stringify(statement);
}

function _stream(content$, res) {
  res.type('json');
  content$
    .map(_toChunk)
    .startWith(HEAD)
    .concat(Rx.Observable.of(TAIL))
    .subscribe(
      value => res.write(value),
      err => {
        console.error(err);
        res.end();
      },
      () => res.end()
    );
}

app.get('/api', (req, res) => {
  const statements$ = service.getStatements(WORDS);
  _stream(statements$, res);
});

app.use('/client', express.static('public'));
app.use('/client', express.static('node_modules/oboe/dist'));
app.use('/client', express.static('node_modules/d3/build'));

app.listen(3000, () => {
  console.log('Streaming answers on port 3000');
});
