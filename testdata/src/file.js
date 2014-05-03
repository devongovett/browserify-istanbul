var ignored = require('./ignored');

module.exports = function(x) {
  if (x < 0)
    x = -x;
    
  return x * x;
};
