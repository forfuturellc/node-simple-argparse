
# simple-argparse

> Simple Argument parser for Command-line Applications

[![node](https://img.shields.io/node/v/simple-argparse.svg?style=flat-square)](https://www.npmjs.com/package/simple-argparse)
[![npm](https://img.shields.io/npm/v/simple-argparse.svg?style=flat-square)](https://www.npmjs.com/package/simple-argparse)
[![Travis](https://img.shields.io/travis/forfuturellc/node-simple-argparse.svg?style=flat-square)](https://travis-ci.org/forfuturellc/node-simple-argparse)
[![Gemnasium](https://img.shields.io/gemnasium/forfuturellc/node-simple-argparse.svg?style=flat-square)](https://gemnasium.com/forfuturellc/node-simple-argparse)
[![Coveralls](https://img.shields.io/coveralls/forfuturellc/node-simple-argparse.svg?style=flat-square)](https://coveralls.io/github/forfuturellc/node-simple-argparse?branch=master)


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
  .option("s", "start", "starts application", startFunc)
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

    H, help     show this help information
    s, start    starts application
    V, version  show version information

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

*  __Parser#option([short:String ,] command:String, description:String [, optionFunction:Function])__

  * __short__: (Optional) short string, preferably one or two letter string that can be used in place of the __command__.
  * __command__:
    * a string that will be typed by user to fire the command
    * any spaces will be replaced by hyphens
  * __description__: help information regarding this command
  * __optionFunction__:(Optional) See [Parsing](#parsing) below for more information.

* __Parser#defaultOption([optionFunction:Function])__

  * __optionFunction__: (Optional) default function to run rather than show help information. See [Parsing](#parsing) below for more information.

* __Parser#prerun([hookFunction:Function])__

  * __hookFunction__: (Optional) function to run before any of the option functions. This function can manipulate the arguments passed to the option functions by using the `this` context.

*  __Parser#epilog(epilog:String)__

  * __epilog__: a string that will appear at the bottom of the help information

*  __Parser#parse([arguments:String|Array])__

  * __arguments__:(Optional)
    * a string or array representing options, for example, `"name --key=value"`, `["name", "--key=value"]`
    * if left out, `process.argv` will be used instead

* __Parser#showHelp()__

  * shows the help information
  * is done by passing all the necessary data as string to the registered output function

* __Parser#showVersion()__

  * similar to __Parser#showHelp()__ but only supplies version information, registered with `.version()`.


<a name="parsing"></a>
## Parsing

All arguments parsed by `.parse()` are processed using
[yargs-parser][argv], and made available to the __option functions__ as
their `this` argument.

An __option function__ refers to the function passed to `.option`.
Options that are __NOT__ perceived as options/flags by __minimist__ are passed
to the function as `arguments`.

The option name, as inputted by the user, is made available to the function at `this._option`.

**Note** that for the default option (`.defaultOption(func)`) no `arguments` can be passed to the option function. Also `this._option` will always equal `"default"`.

Consider the following example:

__parse.js__:

```js
require("simple-argparse")
  .version("0.0.0")
  .option("test", "run tests", function(suite) {
    console.log("this._option === %s", this._option);
    console.log("this.verbose === %s", this.verbose);
    console.log("suite === %s", suite);
  })
  .defaultOption(function() {
    console.log("this._option === %s", this._option);
    console.log("this.verbose === %s", this.verbose);
  })
  .parse();
```

Now running the above script from a terminal:

```bash
# default command
⇒ node parse.js
this._option === default
this.verbose === undefined

# default command
⇒ node parse.js --verbose
this._option === default
this.verbose === true

# test command
⇒ node parse.js test
this._option === test
this.verbose === undefined
suite === undefined

# test command
⇒ node parse.js test someSuite
this._option === test
this.verbose === undefined
suite === someSuite

# test command
⇒ node parse.js test someSuite --verbose
this._option === test
this.verbose === true
suite === someSuite

```

See [yargs-parser][argv] for more information on the parsing.

The __option function__ is optional. If it is left out, the option will
be ignored. This may be useful for commands __not yet implemented__.


## license

__The MIT License (MIT)__

Copyright (c) 2014-2016 Forfuture LLC <we@forfuture.co.ke>


[argv]:https://github.com/yargs/yargs-parser
