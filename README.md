
# simple-argparse

Simple Argument parser for Command-line Applications


## module information 

[![Build Status](https://travis-ci.org/forfuture-dev/node-simple-argparse.svg)](https://travis-ci.org/forfuture-dev/node-simple-argparse)


|Aspect|Detail|
|------|-----:|
|Version|0.0.0-alpha.1.1|
|Node|0.11, 0.10, 0.8, 0.6|
|Last Updated|22nd Dec, 2014|


## installation

```bash
$ npm install simple-argparse
```

## basic usage

<a name="sample"></a>
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
$ node Sample.js
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
  * __optionFunction__:(Optional)
    * Function called when the command is entered by user
    * Is passed __ALL__ arguments following the command as __strings__
    * For example, in the sample script [above](#sample):
        * `$ node Sample.js start localhost 9999`
        * _localhost_ and _9999_ are passed to the option function for _start_ i.e. `startFunc`
    * Leaving out this function, makes the parser ignore this option
    * That may be useful for commands not yet implemented

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

  * similar to __parser#showHelp()__ but only supplies version information


## license

Copyright (c) 2014 Forfuture LLC <we@forfuture.co.ke>

Simple-argparse and its source code is issued under the [MIT][mit] license.


[mit]://https://opensource.org/licenses/MIT