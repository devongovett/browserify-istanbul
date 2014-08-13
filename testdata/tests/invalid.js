var ignored = require('./../src/ignored');

module.exports = function(x) {
  if (x < 0 //Make this invalid .js by removing )
    return true;
};
