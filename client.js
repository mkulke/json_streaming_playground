const oboe = require('oboe');
const request = require('request');
const stream = require('stream');

const passThrough = new stream.PassThrough();

oboe(passThrough)
  .on('node', {
    'hello': name => console.log(name),
  });

request('http://localhost:3000')
  .pipe(passThrough);
