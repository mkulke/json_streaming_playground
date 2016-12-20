'use strict';
const express = require('express')
const Promise = require('bluebird');
const app = express()

function produce(name) {
  return Promise.delay(500, { hello: name })
}

app.get('/', function (req, res) {
  res.type('json');

  res.write('[');
  Promise.mapSeries(['world', 'mundo', 'welt'], (name, i, len) => {
    const seperator = i + 1 < len ? ',' : '';
    return produce(name)
    .tap(obj => res.write(JSON.stringify(obj) + seperator));
  })
  .finally(() => {
    res.write(']');
    res.end()
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
