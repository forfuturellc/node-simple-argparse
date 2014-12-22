
# simple-argparse

Simple Argument parser for Command-line Applications


## module information 

[![Build Status](https://travis-ci.org/forfuture-dev/node-simple-argparse.svg)](https://travis-ci.org/forfuture-dev/node-simple-argparse) [![Dependency Status](https://gemnasium.com/forfuture-dev/node-simple-argparse.svg)](https://gemnasium.com/forfuture-dev/node-simple-argparse) [![Coverage Status](https://img.shields.io/coveralls/forfuture-dev/node-simple-argparse.svg)](https://coveralls.io/r/forfuture-dev/node-simple-argparse)


|Aspect|Detail|
|------|-----:|
|Version|0.0.0|
|Node|0.11, 0.10, 0.8, 0.6|
|Last Updated|22nd Dec, 2014|


## installation

```bash
⇒ npm install simple-argparse
```

## basic usage

_Sample.js_:

```js
require("simple-argparse")
  .description("Application Description")
  .version("0.3.0")
  .option("start", "starts application", startFunc)
  .epilog("See License at http://opensource.org/licenses/MIT")
  .parse()

function startFunc(host, port) {
  app.listen(port, host);
}
```

_Sample Output_:

```bash
⇒ node Sample.js
Application Description

 help     show this help information
 start    starts application
 version  show version information

See License at http://opensource.org/licenses/MIT
```

The module exports a new Parser, that can be used immediately. If you
wish to create more Parsers, you could:

```js
var Parser = require("simple-argparse").Parser;
var myParser = new myParser();
```

While instantiating a parser, an output function may be registered with
the parser other than the default `console.log`

```js
var myOtherParser = new myParser(function(output) {
  socket.emit("commandComplete", output);
});
```

A Parser has these methods:

1. __parser#description([name:String,] description:String)__
  
  * __name__:(Optional) preferably refers to the name of your Application
  * __description__: provides a description of your Application

*  __parser#version(version:String)__

  * __version__: provides version information of your Application
  * defaults to "0.0.0"

*  __parser#option(command:String, description:String [, optionFunction:Function])__

  * __command__:
    * a string that will be typed by user to fire command
    * any spaces will be replaced by hyphens
  * __description__: information regarding this command
  * __optionFunction__:(Optional) See [Parsing](#parsing) below for more information.

*  __parser#epilog(epilog:String)__
   
  * __epilog__: a string that will appear at the bottom of help information

*  __parser#parse([arguments:String])__

  * __arguments__:(Optional)
    * a string representing commands as typed in command-line
    * if left out, `process.argv` will be used instead

* __parser#showHelp()__
  
  * shows the help information
  * is done by passing all the necessary data as string to the registered output function

* __parser#showVersion()__

  * similar to __parser#showHelp()__ but only supplies version information, registered with `.version()`.


<a name="parsing"></a>
## Parsing

All arguments parsed by `.parse()` are processed using
[minimist][minimist], and made available to the __option functions__ as 
their `this` argument.

An __option function__ refers to the function passed to `.option`.
Options that are __NOT__ perceived as options by __minimist__ are passed
to the function as arguments.

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
  .parse()
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
be ignored. This may be useful for commands not yet implemented.


## license

The MIT License (MIT)

Copyright (c) 2014 Forfuture LLC <we@forfuture.co.ke>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.


[minimist]:https://github.com/substack/minimist
