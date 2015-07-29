/**
 * Runs test against the parser
 */


"use strict";


// built-in modules
var childProcess = require("child_process");
var path = require("path");


// npm-installed modules
var should = require("should");


// own modules
var _parser = require("../index");
var Parser = _parser.Parser;


describe("module `simple-argparse`", function() {
  it("exports a new Parser instance", function() {
    should(_parser).be.an.instanceof(Parser);
  });

  it("exports a new Parser constructor", function() {
    should(Parser).be.a.Function();
  });
});


describe("Parser", function() {

  it("constructor allows a stdout function be used", function(done) {
    var parser = new Parser(function(output) {
      should(output).be.a.String();
      return done();
    });
    parser.showHelp();
  });

  it("should have help command by default", function(done) {
    var i = 0;
    var parser = new Parser(function(out) {
      out.should.containEql("help");
      if (++i === 2) {
        done(); // help invoked twice
      }
    });
    parser.showHelp();
    parser.parse("help");
  });

  it("should have version command by default", function(done) {
    var command;
    var version = "0.121.342";
    var parser = new Parser(function(out) {
      if (command === "version") {
        out.should.containEql(version);
      }
      if (command === "help") {
        out.should.containEql("version");
      }
    });
    parser.version(version);
    // show help
    command = "help";
    parser.showHelp();
    // show version
    command = "version";
    parser.showVersion();
    parser.option("exit", "end test", done);
    parser.parse("exit");
  });

  it("should show an error if no such command is found", function(done) {
    var parser = new Parser(function(out) {
      out.should.containEql("INVALID OPTION");
      done();
    });
    parser.parse("NonExistentCommand");
  });

  it("should allow description be added", function(done) {
    var description = "ABCDWXYZ";
    var parser = new Parser(function(out) {
      out.should.containEql(description);
      done();
    });
    parser.description(description);
    parser.showHelp();
  });

  it("should allow name be passed along with description", function(done) {
    var name = "NAME";
    var desc = "DESC";
    var parser = new Parser(function(out) {
      out.should.containEql(name);
      out.should.containEql(desc);
      done();
    });
    parser.description(name, desc);
    parser.showHelp();
  });

  it("should allow setting version definition", function(done) {
    var version = "345.232.43";
    var parser = new Parser(function(out) {
      out.should.containEql(version);
      done();
    });
    parser.version(version);
    parser.showVersion();
  });

  it("defaults to version 0.0.0", function (done) {
    var parser = new Parser(function(out) {
      out.should.containEql("0.0.0");
      done();
    });
    parser.showVersion();
  });

  it("should allow an epilog", function(done) {
    var epilog = "SOME EPILOG FOR US";
    var parser = new Parser(function(out) {
      out.should.containEql(epilog);
      done();
    });
    parser.epilog(epilog);
    parser.showHelp();
  });

  it("should show a fully defined option", function(done) {
    var name = "NAME";
    var desc = "DESC";
    var regexp = new RegExp("\\s*" + name + "\\s+" + desc);
    var parser = new Parser(function(out) {
      out.search(regexp).should.not.equal(-1);
      done();
    });
    parser.option(name, desc, function() {});
    parser.showHelp();
  });

  it("should hide option if description/func is missing", function(done) {
    var name1 = "NAME1";
    var name2 = "NAME2";
    var desc2 = "DESC2";
    var regexp1 = new RegExp("\\s*" + name1 + "\\s*");
    var regexp2 = new RegExp("\\s*" + name2 + "\\s+" + desc2);
    var parser = new Parser(function(out) {
      out.search(regexp1).should.equal(-1);
      out.search(regexp2).should.equal(-1);
      done();
    });
    parser.option(name1).option(name2, desc2).showHelp();
  });

  it("should replaces spaces with hyphens in options", function(done) {
    var name = "SOME SPACE HERE";
    var regexp = new RegExp(name.replace(" ", "-"));
    var parser = new Parser(function(out) {
      out.search(name).should.equal(-1);
      out.search(regexp).should.not.equal(-1);
      done();
    });
    parser.option(name, "DESC", function() {}).showHelp();
  });

  it("should allow options with tags", function(done) {
    var command = "cmd [tag] <tag>";
    var parser = new Parser(function(out) {
      out.should.containEql(command);
    });
    parser.option(command, "some desc", function() {
      done();
    });
    parser.showHelp();
    parser.parse("cmd");
  });

  it("should allow chaining", function() {
    should(function() {
     (new Parser())
      .description("some desc")
      .epilog("some epilog")
      .version("0.22.0")
      .defaultOption()
      .option("ian")
      .option("robot", "call")
      .option("gun", "fight", function() { });
    }).not.throw();
  });

  it("should show  help information", function(done) {
    var parser = new Parser(function(out) {
      out.should.containEql("help");
      done();
    });
    parser.showHelp();
  });
});


describe("Argument parsing", function() {
  it("should parse process.argv if its just .parse()", function(done) {
    var i = 0;
    var cmd = path.join(__dirname, "process.js") + " test ARG1 ARG2";
    function isDone() {
      if (++i === 2) {
        done();
      }
    }
    childProcess.exec(cmd, function(err) {
      should(err).not.be.ok();
      isDone();
    });
    childProcess.exec("node " + cmd, function(err) {
      should(err).not.be.ok();
      isDone();
    });
  });

  it("should parse args passed in .parse(args)", function(done) {
    var name = "NAME";
    var arg1 = "ARG1";
    var arg2 = "ARG2";
    var parser = new Parser(function() { });
    parser.option(name, "blah", function(someArg, anotherArg) {
      someArg.should.equal(arg1);
      anotherArg.should.equal(arg2);
      done();
    }).parse([name, arg1, arg2].join(" "));
  });

  it("should bind a this with the args processed by minimist", function(done) {
    var parser = new Parser(function() { });
    parser.option("test", "some test", function(arg1, arg2) {
      this.name.should.be.eql("gocho");
      arg1.should.eql("arg1");
      arg2.should.eql("arg2");
      done();
    }).parse("test --name=gocho arg1 arg2");
  });

  it("should make available the option name", function(done) {
    var parser = new Parser(function() { });
    parser.option("test", "some test", function() {
      should(this._option).eql("test");
      done();
    }).parse("test");
  });

  it("should call the default function if specified", function(done) {
    var parser = new Parser(function() { });
    parser.defaultOption(function() {
      should(this._option).eql("default");
      should(this.verbose).eql(true);
      done();
    }).parse("--verbose");
  });
});
