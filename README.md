# browserify-istanbul

A [browserify](http://github.com/substack/node-browserify) transform for the [istanbul](https://github.com/gotwarlost/istanbul) code coverage tool.

## Installing

    npm install --save-dev browserify-istanbul

## Usage

There are several ways to register browserify transforms: on the command line, in your `package.json`, or using the browserify API.
You can use all of these with browserify-istanbul: see the [browserify docs](http://github.com/substack/node-browserify) for more info.

There are a few options available to browserify-istanbul when you use it from JavaScript.  They are shown in the following code example:

```javascript
var istanbul = require('browserify-istanbul');

// use without any options...
browserifyBundle.transform(istanbul);

// or with some options...
browserifyBundle.transform(istanbul({
  // ignore these glob paths (the ones shown are the defaults)
  ignore: ['**/node_modules/**', '**/bower_components/**', '**/test/**', '**/tests/**', '**/*.json'],

  // by default, any paths you include in the ignore option are ignored
  // in addition to the defaults. set the defaultIgnore option to false
  // to only ignore the paths you specify.
  defaultIgnore: true
}));
```

### Command line

- without options:

```
./node_modules/.bin/browserify -t browserify-istanbul test/test-*.js -o bundle.js
```

- with options

```
./node_modules/.bin/browserify -t [ browserify-istanbul --ignore "**/bower_components/**" ] test/test-*.js -o bundle.js
```

### Interacting With Coverage Reports

To load and manipulate coverage reports, the command line tool [nyc](https://www.npmjs.com/package/nyc) can be used:

1. output the the `__coverage__` object to `./.nyc_output/coverage.json`.
  * this can be facilitated using a library like [mocha-phantomjs-istanbul](https://www.npmjs.com/package/mocha-phantomjs-istanbul).
2. execute nyc with a list of [reporters](https://github.com/istanbuljs/istanbul-reports/tree/master/lib).
  * `nyc report --reporter=lcov --reporter=text-summary`.

See [istanbul.js.org](https://istanbul.js.org/) for more examples and documentation.

## License

MIT
