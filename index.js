var through = require('through2');
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
  var file;
  options = options || {};

  if (typeof options === 'string') {
    file = options;
    options = extraOptions || {};
    return transform(options, file);
  }

  return transform.bind(null, options);
};

function transform(options, file) {
  if (shouldIgnoreFile(file, options))
    return through();

  var instrumenterConfig = Object.assign({}, {
    autoWrap: true,
    coverageVariable: '__coverage__',
    embedSource: true,
    noCompact: false,
    preserveComments: true,
    produceSourceMap: true
  }, options.instrumenterConfig);

  var instrumenter = (options.instrumenter || require('istanbul-lib-instrument')).createInstrumenter(instrumenterConfig);

  var data = '';
  return through(function(buf, enc, callback) {
    data += buf;
    callback();
  }, function(callback) {
    var self = this;
    instrumenter.instrument(data, file, function(err, code) {
      if (!err) {
        self.push(code);
      } else {
        self.emit('error', err);
      }
      self.push(null);
      callback();
    });
  });
}
