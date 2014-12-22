/*
| simple-argparse
| simple argument parser for command line applications
|
| Author: GochoMugo <mugo@forfuture.co.ke>
| Copyright (c) Forfuture LLC <we@forfuture.co.ke>
| License: MIT
*/


// Module imports
var argv = require("minimist");


/**
* Shifts the process arguments removing the node executable and
* filepath. leaving the rest or arguments
* This function is _impure_. It relies on _process.argv_
* It also has _side_effects_. It manipulates _process.argv_
*/
function processArgv() {
  var args = process.argv;
  args.shift();// node
  args.shift();// filename/command-name
  return args;
}


/**
* Wraps padding space around some text, specfically by adding spaces
* at the end of text
* @param  {String} text
* @param  {Number} width - width of column
* @return {String} padded text
*/
function pad(text, width) {
  var space = (width - text.length) + 5;
  return text + Array(space).join(" ");
}


/**
* Returns `true` if `func` is a Function. Otherwise `false`
*/
function isFunction(func) {
  return typeof(func) === "function";
}


/**
* Returns `true` if `string` is a String. Otherwise `false`
*/
function isString(string) {
  return typeof(string) === "string";
}


/**
* Parser class
* @class
* @param {Function} stdout - called with visual output
* @return {Parser}
*/
var Parser = (function() {
  /**
  * Parser Constructor
  * @param  {Function} stdout - passed output
  */
  function Parser(stdout) {
    this._name;
    this._description;
    this._version = "0.0.0";
    this._commands = {};
    this._epilog;
    this._width = 0;
    this._out = isFunction(stdout) ? stdout : console.log;
    this.option("help", "show this help information",
      this.showHelp.bind(this));
    this.option("version", "show version information",
      this.showVersion.bind(this));
  }

  /**
  * Adds Name and/or Description to the Parser
  * @param  {String} name (Optional)
  * @param  {String} text
  * @param  {Parser} this Parser Instance
  */
  Parser.prototype.description = function(name, text) {
    if (! text) {
      this._description = name;
    } else {
      this._name = name;
      this._description = text;
    }
    return this;
  };

  /**
  * Adds Version information
  * @param  {String} version
  * @return {Parser} this Parser instance
  */
  Parser.prototype.version = function(version) {
    this._version = version;
    return this;
  };

  /**
  * Adds an option/command
  * @param  {String} command
  * @param  {String} description
  * @param  {Function} func
  * @return {Parser} this Parser instance
  */
  Parser.prototype.option = function(command, description, func) {
    if (!(isFunction(func) && isString(description) && isString(command))) {
      return this;
    }
    var idx = command.search(/[\[<]/);
    var key = idx < 0 ? command : command.substring(0, idx);
    var tag = idx < 0 ? "" : command.substring(idx);
    key = key.trim();
    key = key.replace(" ", "-");
    tag = tag.trim();
    command = key + " " + tag;
    this._commands[key] = {
      description: description.trim(),
      func: func,
      repr: command
    };
    var length = command.length;
    if (length > this._width) this._width = length;
    return this;
  };

  /**
  * Adds a bottom epilog
  * @param  {String} epilog
  * @return {Parser} this Parser instance
  */
  Parser.prototype.epilog = function(epilog) {
    this._epilog = isString(epilog) ? epilog : undefined;
    return this;
  };

  /**
  * Parses a string for commands
  * @param  {String} commandString
  * @return {Parser} this Parser instance
  */
  Parser.prototype.parse = function(cmds) {
    var args = isString(cmds) ? cmds.split(" ") : processArgv();
    if (args.length === 0) { return this.showHelp(); }
    var command = args.shift();
    args = argv(args);
    if (! this._commands[command]) {
      var output = "INVALID OPTION: " + command;
      output += "\nTry \"help\" for a list of available commands";
      this._out(output);
    } else {
      this._commands[command].func.apply(args, args._);
    }
    return this;
  };

  /**
  * Show help: name, description, options and epilog strings are
  * passed to the output function
  */
  Parser.prototype.showHelp = function() {
    var output = "";
    if (this._name) { output += this._name + ": "; }
    output += (this._description || "") + "\n\n";
    var commands = [];
    for (var command in this._commands) {
      commands.push(" " +
        pad(this._commands[command].repr, this._width) +
        this._commands[command].description);
    }
    commands = commands.sort();
    output += commands.join("\n") + "\n";
    if (this._epilog) output += "\n" + this._epilog;
    this._out(output);
  };

  /**
  * Show version: name and version strings are passed to the output
  * function
  */
  Parser.prototype.showVersion = function() {
    var info = "";
    if (this._name) { info += this._name + " "; }
    info += this._version;
    this._out(info); 
  };

  return Parser;
})();


/**
* Exporting a new Parser by just `require()`ing the module
* Parser may be also be accessed by require(..).Parser
*/
exports = module.exports = (new Parser());
exports.Parser = Parser;
