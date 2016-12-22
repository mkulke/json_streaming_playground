'use strict';
const Promise = require('bluebird');
const Rx = require('rxjs/Rx');

function _produce(word) {
  if (typeof word !== 'string') {
    return Promise.reject('not a string');
  }
  return Promise.delay(100 * word.length, { hello: word });
}

function _errorHandler(err) {
  console.error(err);
  return Rx.Observable.empty();
}

function _toObservable(promises) {
  return Rx.Observable.from(promises)
    .flatMap(promise => {
      const observable = Rx.Observable.fromPromise(promise);
      return observable.catch(_errorHandler);
    });
}

function getStatements(words) {
  const promises = words.map(_produce);
  const observable = _toObservable(promises);
  return observable;
}

module.exports = {
  getStatements,
};
