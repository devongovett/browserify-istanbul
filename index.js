var istanbul = require('istanbul');
var through = require('through');
var minimatch = require('minimatch');
var path = require('path');

var instrumenter = new istanbul.Instrumenter();
var defaultIgnore = ['**/node_modules/**', '**/test/**', '**/tests/**', '**/*.json'];

module.exports = function(options, extraOptions) {
  options = options || {};

  function transform(file) {
    var ignore = options.defaultIgnore === false ? [] : defaultIgnore;
    ignore = ignore.concat(options.ignore || []);
    instrumenter = options.instrumenter !== undefined ? options.instrumenter : new istanbul.Instrumenter();

    if (ignore.some(minimatch.bind(null, file)))
      return through();

    var data = '';
    return through(function(buf) {
      data += buf;
    }, function() {
      var self = this;
      instrumenter.instrument(data, file, function(err, code) {
        if (!err) {
          self.queue(code);
        } else {
          self.emit('error', err);
        }
        self.queue(null);
      });
    });
  }

  if (typeof options === 'string') {
    var file = options;
    options = extraOptions || {};
    return transform(file);
  }

  return transform;
};
