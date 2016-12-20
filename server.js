'use strict';
const express = require('express')
const Promise = require('bluebird');
const app = express()

function produce(name) {
  if (typeof name === 'string') {
    return Promise.delay(500, { hello: name })
  }
  return Promise.reject('not a string');
}

app.get('/', function (req, res) {
  res.type('json');

  res.write('[');
  Promise.mapSeries(['world', 'mundo', 5, 'welt'], (name, index) => {
    const seperator = index === 0 ? '' : ',';
    return produce(name)
    .tap(obj => res.write(seperator + JSON.stringify(obj)))
    .catch(console.error);
  })
  .finally(() => {
    res.write(']');
    res.end()
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
