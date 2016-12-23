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

function _toObservable(promise) {
  return Rx.Observable.fromPromise(promise).catch(_errorHandler);
}

function getStatements(words) {
  const promises = words.map(_produce);
  return Rx.Observable.from(promises).flatMap(_toObservable);
}

module.exports = {
  getStatements,
};
