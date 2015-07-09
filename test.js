'use strict';

/* deps: mocha */
var path = require('path');
var should = require('should');
var parsePath = require('./');

describe('parse-filepath:', function() {
  describe('dotfiles', function() {
    it('should recognize dotfiles', function() {
      parsePath('foo/bar/baz/.dotfile').should.eql({
        name: '.dotfile',
        dirname: 'foo/bar/baz',
        extname: '',
        basename: '.dotfile',
        root: '',
      });
    });

    it('should recognize .gitignore', function() {
      parsePath('./.gitignore').should.eql({
        name: '.gitignore',
        dirname: '.',
        extname: '',
        basename: '.gitignore',
        root: '',
      });
    });

    it('should recognize config files', function() {
      parsePath('./.verbfile.md').should.eql({
        name: '.verbfile',
        dirname: '.',
        extname: '.md',
        basename: '.verbfile.md',
        root: '',
      });
    });

    it('should recognize config files', function() {
      parsePath('./.travis.yml').should.eql({
        name: '.travis',
        dirname: '.',
        extname: '.yml',
        basename: '.travis.yml',
        root: '',
      });
    });
  });

  describe('when a single segment is passed', function() {
    it('should return the correct values', function() {
      parsePath('foo').should.eql({
        name: 'foo',
        dirname: '',
        extname: '',
        basename: 'foo',
        root: '',
      });
    });

    it('should return the correct values', function() {
      parsePath('./foo').should.eql({
        name: 'foo',
        dirname: '.',
        extname: '',
        basename: 'foo',
        root: '',
      });
    });
  });

  describe('when a filepath is passed', function() {
    it('should return an object of path parts', function() {
      parsePath('foo/bar/baz/index.html').should.eql({
        name: 'index',
        dirname: 'foo/bar/baz',
        extname: '.html',
        basename: 'index.html',
        root: '',
      });
    });

    it('should get the root', function() {
      parsePath('/foo/bar/baz/index.html').should.eql({
        name: 'index',
        dirname: '/foo/bar/baz',
        extname: '.html',
        basename: 'index.html',
        root: '/',
      });
    });
  });

  describe('when a filepath ends with a slash', function() {
    it('dirname should be the full filepath, and basename should be empty', function() {
      parsePath('foo/bar/baz/quux/').should.eql({
        name: 'quux',
        dirname: 'foo/bar/baz',
        extname: '',
        basename: 'quux',
        root: '',
      });
    });
  });

  describe('when a filepath with multiple extensions is passed', function() {
    it('should return an object of path parts', function() {
      parsePath('foo/bar/baz/index.md.html').should.eql({
        name: 'index.md',
        dirname: 'foo/bar/baz',
        extname: '.html',
        basename: 'index.md.html',
        root: '',
      });
    });
  });

  describe('when a filepath with zero extensions is passed', function() {
    it('should return an object of path parts', function() {
      parsePath('foo/bar/baz/index').should.eql({
        name: 'index',
        dirname: 'foo/bar/baz',
        extname: '',
        basename: 'index',
        root: '',
      });
    });
  });

  describe('when a dirname is "."', function() {
    it('should preserve the basename', function() {
      parsePath('index.js').should.eql({
        dirname: '',
        basename: 'index.js',
        name: 'index',
        extname: '.js',
        root: ''
      });
    });
    it('should parse paths without extensions', function() {
      parsePath('foo/bar/baz/index').should.eql({
        name: 'index',
        dirname: 'foo/bar/baz',
        extname: '',
        basename: 'index',
        root: '',
      });
    });

    it('should return the extension from options.ext', function() {
      parsePath('foo/bar/baz.min.js').extname.should.eql('.js');
    });
    it('should parse the extname', function() {
      parsePath('foo/bar/baz.js').extname.should.eql('.js');
    });
    it('should return an empty extname when no extension is passed', function() {
      parsePath('foo/bar/baz').extname.should.eql('');
    });
  });
});