var istanbul = require('istanbul');
var through = require('through');
var minimatch = require('minimatch');
var path = require('path');

var instrumenter = new istanbul.Instrumenter();
var defaultIgnore = ['**/node_modules/**', '**/test/**', '**/tests/**'];

module.exports = function(options) {
  options = options || {};
  
  function transform(file) {
    var ignore = options.defaultIgnore === false ? [] : defaultIgnore;
    ignore = ignore.concat(options.ignore || []);
    
    if (ignore.some(minimatch.bind(null, file)))
      return through();
    
    var data = '';
    return through(function(buf) {
      data += buf;
    }, function() {
      var self = this;
      instrumenter.instrument(data, file, function(err, code) {
        self.queue(code);
        self.queue(null);
      });
    });
  }
      
  if (typeof options === 'string') {
    var file = options;
    options = {};
    return transform(file);
  }
  
  return transform;
};
