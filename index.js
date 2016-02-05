var istanbul = require('istanbul');
var through = require('through');
var minimatch = require('minimatch');

var defaultIgnore = ['**/node_modules/**', '**/bower_components/**', '**/test/**', '**/tests/**', '**/*.json'];

function shouldIgnoreFile(file, options) {
  var ignore = options.defaultIgnore === false ? [] : defaultIgnore;
  ignore = ignore.concat(options.ignore || []);

  return ignore.some(function(pattern) {
    return minimatch(file, pattern, options.minimatchOptions);
  });
}

module.exports = function(options, extraOptions) {
  options = options || {};

  function transform(file) {
    if (shouldIgnoreFile(file, options))
      return through();

    var instrumenter = new (options.instrumenter || istanbul).Instrumenter(options.instrumenterConfig || {});

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
