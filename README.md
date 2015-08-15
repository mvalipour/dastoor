# dastoor
[![travis](https://travis-ci.org/mvalipour/dastoor.svg?branch=master)](https://travis-ci.org/mvalipour/dastoor)

a node.js library to build command-line interface tools.

## Installation

```
npm install dastoor --save
```

## Usage

Create an `index.js` file:

```javascript
#! /usr/bin/env node
var dastoor = require('dastoor'),
    cli     = dastoor.builder,
    runner  = new dastoor.Runner();

var root = cli.node('my-cli', function() {
    console.log('hello world!');
});

cli.node('my-cli.sub', { terminal: true})
   .controller(function(args) {
       console.log('hello world level 2!');
       console.log('args: ', args);
   });

runner.run(root, process.argv.splice(2));
```

add this to your `packages.json` file.

```javascript
  "bin": {
    "my-cli": "index.js"
  }
```

finally link your command to npm:

> you'd only need this on dev machine, npm does it for you if you install using `-g` switch

```
npm link
```

Your command line interface is ready! run the following commands:

```
my-cli -h
my-cli sub -h
my-cli
my-cli sub
```

There are much more you can do with *dastoor*, see the [API Reference](https://github.com/mvalipour/dastoor/wiki/API-Reference).

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

Developed and maintained by [Mo Valipour](https://github.com/mvalipour).

See license info [here](https://github.com/mvalipour/dastoor/blob/master/license.txt).
