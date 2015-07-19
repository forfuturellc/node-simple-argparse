#!/usr/bin/env node


"use strict";


var should = require("should");
var ARG1 = "ARG1";
var ARG2 = "ARG2";


require("../index")
  .description("onpm", "Some description about Application")
  .version("0.0.0")
  .option("test", "test this command", function(arg1, arg2) {
    should(arg1).be.equal(ARG1);
    should(arg2).be.equal(ARG2);
  })
  .epilog("An epilog appears at the end")
  .parse();
