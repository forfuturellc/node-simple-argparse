
# simple-argparse

> Simple Argument parser for Command-line Applications

[![node](https://img.shields.io/node/v/node-simple-argparse.svg?style=flat-square)](https://www.npmjs.com/package/simple-argparse) [![npm](https://img.shields.io/npm/v/simple-argparse.svg?style=flat-square)](https://www.npmjs.com/package/simple-argparse) [![Travis](https://img.shields.io/travis/forfutureLLC/node-simple-argparse.svg?style=flat-square)](https://travis-ci.org/forfutureLLC/node-simple-argparse) [![Gemnasium](https://img.shields.io/gemnasium/forfutureLLC/node-simple-argparse.svg?style=flat-square)](https://gemnasium.com/forfutureLLC/node-simple-argparse) [![Coveralls](https://img.shields.io/coveralls/forfutureLLC/node-simple-argparse.svg?style=flat-square)](https://coveralls.io/github/forfutureLLC/node-simple-argparse?branch=master)


## installation

```bash
⇒ npm install simple-argparse
```


## basic usage

_sample.js_:

```js
require("simple-argparse")
  .description("Application Description")
  .version("0.3.0")
  .option("start", "starts application", startFunc)
  .epilog("See License at http://opensource.org/licenses/MIT")
  .parse();

function startFunc(host, port) {
  app.listen(port, host);
}
```

_sample output_:

```bash
⇒ node Sample.js
 Application Description

    help     show this help information
    start    starts application
    version  show version information

 See License at http://opensource.org/licenses/MIT
```


## API

The module exports a new `Parser` instance, that can be used immediately. If you wish to create more parsers, you instead use the `Parser` constructor exported at `.Parser`:

```js
var Parser = require("simple-argparse").Parser;
var myParser = new Parser();
```

While instantiating a parser, an output function may be registered with
the parser other than the default `console.log`:

```js
var myOtherParser = new Parser(function(output) {
  socket.emit("commandComplete", output);
});
```

A `Parser` has these methods:

1. __Parser#description([name:String,] description:String)__

  * __name__:(Optional) refers to the name of your Application
  * __description__: provides a description of your Application

*  __Parser#version(version:String)__

  * __version__: provides version information of your Application. Defaults to `"0.0.0"`

*  __Parser#option(command:String, description:String [, optionFunction:Function])__

  * __command__:
    * a string that will be typed by user to fire the command
    * any spaces will be replaced by hyphens
  * __description__: help information regarding this command
  * __optionFunction__:(Optional) See [Parsing](#parsing) below for more information.

*  __Parser#epilog(epilog:String)__

  * __epilog__: a string that will appear at the bottom of the help information

*  __Parser#parse([arguments:String])__

  * __arguments__:(Optional)
    * a string representing commands as typed in command-line
    * if left out, `process.argv` will be used instead

* __Parser#showHelp()__

  * shows the help information
  * is done by passing all the necessary data as string to the registered output function

* __Parser#showVersion()__

  * similar to __Parser#showHelp()__ but only supplies version information, registered with `.version()`.


<a name="parsing"></a>
## Parsing

All arguments parsed by `.parse()` are processed using
[minimist][minimist], and made available to the __option functions__ as
their `this` argument.

An __option function__ refers to the function passed to `.option`.
Options that are __NOT__ perceived as options by __minimist__ are passed
to the function as `arguments`.

Consider the following example:

__parse.js__:

```js
require("simple-argparse")
  .version("0.0.0")
  .option("test", "run tests", function(suite) {
    if (this.verbose) { console.log("--verbose was used"); }
    if (suite) {
      console.log("will run tests only for: " + suite);
    } else {
      console.log("will run all tests!");
    }
    // ...
  })
  .parse();
```

Now running the above script from a terminal:

```bash
⇒ node parse.js test
will run all tests!

⇒ node parse.js test someSuite
will run tests only for: someSuite

⇒ node parse.js test someSuite --verbose
--verbose was used
will run tests only for: someSuite

```

See [minimist][minimist] for more information on the parsing.

The __option function__ is optional. If it is left out, the option will
be ignored. This may be useful for commands __not yet implemented__.


## license

__The MIT License (MIT)__

Copyright (c) 2014-2015 Forfuture LLC <we@forfuture.co.ke>


[minimist]:https://github.com/substack/minimist
