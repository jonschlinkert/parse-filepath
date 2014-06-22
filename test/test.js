/**
  * parse-filepath <https://github.com/jonschlinkert/parse-filepath>
  *
  * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
  * Licensed under the MIT License
  *
  */

var expect = require('chai').expect;
var file = require('fs-utils');
var parsePath = require('../');

      // file.writeJSONSync('path.json', actual);

describe('parse-filepath:', function() {
  describe('dotfiles', function() {
    it('should recognize dotfiles', function() {
      var actual = parsePath('foo/bar/baz/.dotfile');
      var expected = {
        name: '.dotfile',
        dirname: 'foo/bar/baz',
        extname: '',
        basename: '.dotfile',
        extSegments: []
      };
      expect(actual).to.eql(expected);
    });

    it('should recognize dotfiles', function() {
      var actual = parsePath('./.dotfile');
      var expected = {
        name: '.dotfile',
        dirname: '.',
        extname: '',
        basename: '.dotfile',
        extSegments: []
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when a single segment is passed', function() {
    it('should return the correct values', function() {
      var actual = parsePath('foo');
      var expected = {
        name: 'foo',
        dirname: '.',
        extname: '',
        basename: 'foo',
        extSegments: []
      };
      expect(actual).to.eql(expected);
    });

    it('should return the correct values', function() {
      var actual = parsePath('./foo');
      var expected = {
        name: 'foo',
        dirname: '.',
        extname: '',
        basename: 'foo',
        extSegments: []
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when a filepath is passed', function() {

    it('should return an object of path parts', function() {
      var actual = parsePath('foo/bar/baz/index.html');
      var expected = {
        name: 'index',
        dirname: 'foo/bar/baz',
        extname: '.html',
        basename: 'index.html',
        extSegments: ['.html']
      };
      expect(actual).to.eql(expected);
    });
  });


  describe('when a filepath with multiple extensions is passed', function() {
    it('should return an object of path parts', function() {
      var actual = parsePath('foo/bar/baz/index.md.html');
      var expected = {
        name: 'index',
        dirname: 'foo/bar/baz',
        extname: '.md.html',
        basename: 'index.md.html',
        extSegments: ['.md', '.html']
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when a filepath with zero extensions is passed', function() {
    it('should return an object of path parts', function() {
      var actual = parsePath('foo/bar/baz/index');
      var expected = {
        name: 'index',
        dirname: 'foo/bar/baz',
        extname: '',
        basename: 'index',
        extSegments: []
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when a dirname is "."', function() {
    it('should preserve the basename', function() {
      var actual = parsePath('index.js');
      var expected = {
        dirname: '.',
        basename: 'index.js',
        name: 'index',
        extname: '.js',
        extSegments: ['.js'],
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when a filepath with zero extensions is passed', function() {
    it('should return an object of path parts', function() {
      var actual = parsePath('foo/bar/baz/index/');
      var expected = {
        name: 'index',
        dirname: 'foo/bar/baz',
        extname: '',
        basename: 'index',
        extSegments: []
      };
      expect(actual).to.eql(expected);
    });
  });
});

describe('utils.ext()', function() {
  describe('when a filepath with multiple extensions is passed:', function() {
    var filepath = 'foo/bar/baz.min.js';

    it('should return the extension from options.ext', function() {
      var actual = parsePath(filepath);
      expect(actual.extname).to.eql('.min.js');
    });

    it('should return the extension from options.ext', function() {
      var actual = parsePath(filepath);
      expect(actual.extSegments).to.eql(['.min', '.js']);
    });
  });

  describe('when a filepath with a single extension is passed:', function() {
    var filepath = 'foo/bar/baz.js';

    it('should return the extname', function() {
      var actual = parsePath(filepath);
      expect(actual.extname).to.eql('.js');
    });

    it('should return an array with the extname', function() {
      var actual = parsePath(filepath);
      expect(actual.extSegments).to.eql(['.js']);
    });
  });

  describe('when a filepath with no extensions is passed:', function() {
    var filepath = 'foo/bar/baz';

    it('should return an empty extname', function() {
      var actual = parsePath(filepath);
      expect(actual.extname).to.eql('');
    });

    it('should return an empty extSegments array', function() {
      var actual = parsePath(filepath);
      expect(actual.extSegments).to.eql([]);
    });
  });
});