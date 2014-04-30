/**
  * parse-filepath <https://github.com/jonschlinkert/parse-filepath>
  *
  * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
  * Licensed under the MIT License
  *
  */

var expect = require('chai').expect;
var file = require('fs-utils');
var obj = require('../');

var upper = function(str) {
  return str.toUpperCase();
};

describe('parse-filepath:', function() {
  describe('when a filepath is passed', function() {
    it('should return an object of path parts', function() {
      var actual = obj('foo/index.html');
      file.writeJSONSync('path.json', actual);
      var expected = {
        filepath: 'foo/index.html',
        dir: 'foo',
        dirname: 'foo',
        filename: 'index.html',
        basename: 'index.html',
        name: 'index',
        ext: '.html',
        extname: '.html',
        fn: ''
      };
      expect(actual).to.eql(expected);
    });
  });


  describe('when a function is passed as the second parameter', function() {
    it('should use the function on the filepath and return the result on the fn propety', function() {
      var actual = obj('foo/index.html', upper);
      expect(actual.fn).to.eql('FOO/INDEX.HTML');
    });
  });
});

