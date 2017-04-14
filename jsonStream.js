const Rx = require('rxjs/Rx');

const HEAD = '[';
const SEPARATOR = ',';
const TAIL = ']';

function stream(req, res, next) {
  class StatefulSubscriber extends Rx.Subscriber {
    constructor() {
      super();
      this.counter = 0;
    }

    next(element) {
      if (this.counter === 0) {
        res.write(HEAD);
      } else {
        res.write(SEPARATOR);
      }
      this.counter++;
      const chunk = JSON.stringify(element);
      res.write(chunk);
    }

    error(err) {
      next(err);
    }

    complete() {
      if (this.counter === 0) {
        res.write(HEAD);
      }
      res.write(TAIL);
      res.end();
    }
  }

  res.stream = content$ => {
    res.type('json');
    content$.subscribe(new StatefulSubscriber);
  };

  next();
}

module.exports = stream;
