const Rx = require('rxjs/Rx');

const HEAD = '[';
const SEPARATOR = ',';
const TAIL = ']';

function _toChunk(statement, index) {
  const separator = index === 0 ? '' : SEPARATOR;
  return separator + JSON.stringify(statement);
}

function stream(req, res, next) {
  res.stream = content$ => {
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
  };
  next();
}

module.exports = stream;
