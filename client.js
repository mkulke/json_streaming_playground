const oboe = require('oboe');
const request = require('request');

const oboeStream = oboe()
.on('node', {
  'hello': name => console.log(name),
});

const req = request('http://localhost:3000');

req.on('data', chunk => {
  oboeStream.emit('data', chunk.toString());
});

req.on('end', () => {
  oboeStream.emit('end');
});
