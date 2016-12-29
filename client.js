const oboe = require('oboe');
const request = require('request');
const stream = require('stream');

const passThrough = new stream.PassThrough();
const then = Date.now();

oboe(passThrough)
  .on('node', {
    'hello': name => console.log(`${name} (${Date.now() - then}ms)`),
  });

request('http://localhost:3000/api')
  .pipe(passThrough);
