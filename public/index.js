'use strict';

var scale = d3.scaleLinear().range([0, 400]);

function draw(data) {
  var times = data.map(function(entry) {
    return entry.time;
  });

  scale.domain([0, d3.max(times)]);

  var words = d3.select('.chart')
    .selectAll('.word')
    .data(data);

  words.enter().append('div')
    .attr('class', 'word')
    .text(function(d) {
      return d.text;
    });

  var bars = d3.select('.chart')
    .selectAll('.bar')
    .data(data);

  var word = bars
    .enter()
    .append('div')
    .attr('class', 'bar')
    .text(function(d) {
      return d.time + 'ms';
    });

  word.merge(bars)
    .style('width', function(d) {
      return scale(d.time) + "px";
    })
}

function start() {
  var then = Date.now();
  var data = [];
  var handleHello = function(name) {
    var msecs = Date.now() - then;
    data.push({ time: msecs, text: name });
    draw(data);
  };
  oboe('/api').node({ 'hello': handleHello });
}
