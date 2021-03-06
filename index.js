/*
 | simple-argparse
 | simple argument parser for command line applications
 |
 | Author: GochoMugo <mugo@forfuture.co.ke>
 | Copyright (c) Forfuture LLC <we@forfuture.co.ke>
 | License: MIT
 */


"use strict";


// npm-installed modules
var argv = require("yargs-parser");


/**
 * Slices the process arguments removing the node executable and
 * filepath, leaving the rest of the arguments.
 * This function is _impure_; it relies on _process.argv_
 *
 * @return {Array} arguments
 */
function processArgv() {
  return process.argv.slice(2);
}


/**
 * Appends padding space to some text.
 *
 * @param  {String} text
 * @param  {Number} width - width of column
 * @return {String} padded text
 */
function pad(text, width) {
  var space = (width - text.length) + 5;
  return text + Array(space).join(" ");
}


/**
 * Returns `true` if `variable` is a Function. Otherwise `false`.
 *
 * @param  {*} variable
 * @return {Boolean}
 */
function isFunction(variable) {
  return typeof variable === "function";
}


/**
 * Returns `true` if `variable` is a String. Otherwise `false`.
 *
 * @param  {*} variable
 * @return {Boolean}
 */
function isString(variable) {
  return typeof variable === "string";
}


/**
 * Returns `true` if `variable` is an Array. Otherwise `false`.
 *
 * @param {*} variable
 * @return {Boolean}
 */
function isArray(variable) {
  return variable instanceof Array;
}


/**
 * Parser.
 *
 * @constructor
 * @param  {Function} stdout - passed output
 * @return {Parser}
 */
function Parser(stdout) {
  this._name = null;
  this._description = null;
  this._version = "0.0.0";
  this._epilog = null;
  this._commands = { };
  this._short = { };
  this._default = this.showHelp.bind(this);
  this._hooks = { };
  this._width = 0;
  this._out = isFunction(stdout) ? stdout : console.log;
  this.option("H", "help", "show this help information", this.showHelp.bind(this));
  this.option("V", "version", "show version information", this.showVersion.bind(this));
  return this;
}


/**
 * Adds Name and/or Description to the Parser.
 *
 * @param  {String} [name]
 * @param  {String} text
 * @return {Parser} this Parser Instance
 */
Parser.prototype.description = function description(name, text) {
  if (!text) {
    this._description = name;
  } else {
    this._name = name;
    this._description = text;
  }
  return this;
};


/**
 * Adds Version information.
 *
 * @param  {String} versionNum
 * @return {Parser} this Parser instance
 */
Parser.prototype.version = function version(versionNum) {
  this._version = versionNum;
  return this;
};


/**
 * Adds an option/command.
 *
 * @param  {String} [alias]
 * @param  {String} command
 * @param  {String} description
 * @param  {Function} [func]
 * @return {Parser} this Parser instance
 */
Parser.prototype.option = function option(alias, command, description, func) {
  if ((!func) && alias && command && isFunction(description)) {
    func = description;
    description = command;
    command = alias;
    alias = undefined;
  }
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
  if (alias) {
    this._short[alias] = key;
    command = alias + ", " + command;
  }
  this._commands[key] = {
    description: description.trim(),
    func: func,
    repr: command,
  };
  var length = command.length;
  if (length > this._width) {
    this._width = length;
  }
  return this;
};


/**
 * Adds the default function to run if no command is specified.
 *
 * @param  {Function} func
 * @return {Parser} this Parser instance
 */
Parser.prototype.defaultOption = function defaultOption(func) {
  if (func) {
    this._default = func;
  }
  return this;
};


/**
 * Add a pre-run function.
 *
 * @param  {Function} func
 * @return {Parser} this Parser instance
 */
Parser.prototype.prerun = function prerun(func) {
  if (func) {
    this._hooks.prerun = func;
  }
  return this;
};


/**
 * Adds a bottom epilog.
 *
 * @param  {String} epilog
 * @return {Parser} this Parser instance
 */
Parser.prototype.epilog = function(epilog) {
  this._epilog = isString(epilog) ? epilog : undefined;
  return this;
};


/**
 * Parses a string for commands.
 *
 * @param  {String|Array} cmds - commands/args
 * @return {Parser} this Parser instance
 */
Parser.prototype.parse = function parse(cmds) {
  var me = this;
  var args;
  if (isString(cmds)) {
    args = cmds.split(" ");
  } else if (isArray(cmds)) {
    args = cmds;
  } else {
    args = processArgv();
  }
  var context = { };
  var command = args[0];
  function exec(target, ctx) {
    if (me._hooks.prerun) {
      me._hooks.prerun.apply(ctx, ctx._);
    }
    target.apply(ctx, ctx._);
  }
  if (command === undefined || command === "" || command[0] === "-") {
    context = argv(args);
    context._option = "default";
    exec(me._default, context);
  } else if (me._commands[command] || me._short[command]) {
    var target = me._commands[command] || me._commands[me._short[command]];
    var option = args.shift();
    context = argv(args);
    context._option = option;
    exec(target.func, context);
  } else {
    var output = "INVALID OPTION: " + command;
    output += "\nTry \"help\" for a list of available commands";
    me._out(output);
  }
  return me;
};


/**
 * Show help information; name, description, options and epilog strings are
 * passed to the output function.
 *
 * @return {Parser} this Parser instance
 */
Parser.prototype.showHelp = function showHelp() {
  var output = " ";
  if (this._name) {
    output += this._name + ": ";
  }
  output += (this._description || "") + "\n\n";
  var commands = [];
  for (var command in this._commands) {
    commands.push("     " +
      pad(this._commands[command].repr, this._width) +
      this._commands[command].description);
  }
  commands = commands.sort();
  output += commands.join("\n") + "\n";
  if (this._epilog) {
    output += "\n " + this._epilog;
  }
  this._out(output);
  return this;
};


/**
 * Show version information; name and version strings are passed to the
 * output function.
 *
 * @return {Parser} this Parser instance
 */
Parser.prototype.showVersion = function showVersion() {
  var info = "";
  if (this._name) {
    info += this._name + " ";
  }
  info += this._version;
  this._out(info);
  return this;
};


/**
 * Exporting a new Parser by just `require()`ing the module
 * Parser may be also be accessed by require(..).Parser
 */
exports = module.exports = new Parser();
exports.Parser = Parser;
