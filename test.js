'use strict';

/* deps: mocha */
var path = require('path');
require('should');
var parsePath = require('./');
var hasParse = typeof path.parse === 'function';

if (hasParse) {
  describe('with native `path.parse` method:', function() {
    describe('dotfiles', function() {
      it('should get the absolute path:', function() {
        var parsed = parsePath('foo/bar/baz/.dotfile');
        parsed.should.have.property('absolute', path.resolve('foo/bar/baz/.dotfile'));
      });

      it('should specify if a path is absolute:', function() {
        parsePath('foo/bar/baz/.dotfile').isAbsolute.should.be.false;;
        parsePath('/foo/bar/baz/.dotfile').isAbsolute.should.be.true;
      });

      it('should recognize dotfiles', function() {
        var parsed = parsePath('foo/bar/baz/.dotfile');
        parsed.should.have.property('path', 'foo/bar/baz/.dotfile');
        parsed.should.have.property('name', '.dotfile');
        parsed.should.have.property('dirname', 'foo/bar/baz');
        parsed.should.have.property('extname', '');
        parsed.should.have.property('name', '.dotfile');
      });

      it('should recognize .gitignore', function() {
        var parsed = parsePath('./.gitignore');
        parsed.should.have.property('name', '.gitignore');
        parsed.should.have.property('dirname', '.');
        parsed.should.have.property('extname', '');
        parsed.should.have.property('basename', '.gitignore');
        parsed.should.have.property('root', '');
      });

      it('should recognize config files', function() {
        var parsed = parsePath('./.verbfile.md');
        parsed.should.have.property('name', '.verbfile');
        parsed.should.have.property('dirname', '.');
        parsed.should.have.property('extname', '.md');
        parsed.should.have.property('basename', '.verbfile.md');
        parsed.should.have.property('root', '');
      });

      it('should recognize config files', function() {
        var parsed = parsePath('./.travis.yml');
        parsed.should.have.property('name', '.travis');
        parsed.should.have.property('dirname', '.');
        parsed.should.have.property('extname', '.yml');
        parsed.should.have.property('basename', '.travis.yml');
        parsed.should.have.property('root', '');
      });
    });

    describe('when a single segment is passed', function() {
      it('should return the correct values', function() {
        var parsed = parsePath('foo');
        parsed.should.have.property('name', 'foo');
        parsed.should.have.property('dirname', '');
        parsed.should.have.property('extname', '');
        parsed.should.have.property('basename', 'foo');
        parsed.should.have.property('root', '');
      });

      it('should return the correct values', function() {
        var parsed = parsePath('./foo');
        parsed.should.have.property('name', 'foo');
        parsed.should.have.property('dirname', '.');
        parsed.should.have.property('extname', '');
        parsed.should.have.property('basename', 'foo');
        parsed.should.have.property('root', '');
      });
    });

    describe('when a filepath is passed', function() {
      it('should return an object of path parts', function() {
        var parsed = parsePath('foo/bar/baz/index.html');
        parsed.should.have.property('name', 'index');
        parsed.should.have.property('dirname', 'foo/bar/baz');
        parsed.should.have.property('extname', '.html');
        parsed.should.have.property('basename', 'index.html');
        parsed.should.have.property('root', '');
      });

      it('should get the root', function() {
        var parsed = parsePath('/foo/bar/baz/index.html');
        parsed.should.have.property('name', 'index');
        parsed.should.have.property('dirname', '/foo/bar/baz');
        parsed.should.have.property('extname', '.html');
        parsed.should.have.property('basename', 'index.html');
        parsed.should.have.property('root', '/');
      });
    });

    describe('when a filepath ends with a slash', function() {
      it('dirname should be the full filepath, and basename should be empty', function() {
        var parsed = parsePath('foo/bar/baz/quux/');
        parsed.should.have.property('name', 'quux');
        parsed.should.have.property('dirname', 'foo/bar/baz');
        parsed.should.have.property('extname', '');
        parsed.should.have.property('basename', 'quux');
        parsed.should.have.property('root', '');
      });
    });

    describe('when a filepath with multiple extensions is passed', function() {
      it('should return an object of path parts', function() {
        var parsed = parsePath('foo/bar/baz/index.md.html');
        parsed.should.have.property('name', 'index.md');
        parsed.should.have.property('dirname', 'foo/bar/baz');
        parsed.should.have.property('extname', '.html');
        parsed.should.have.property('basename', 'index.md.html');
        parsed.should.have.property('root', '');
      });
    });

    describe('when a filepath with zero extensions is passed', function() {
      it('should return an object of path parts', function() {
        var parsed = parsePath('foo/bar/baz/index');
        parsed.should.have.property('name', 'index');
        parsed.should.have.property('dirname', 'foo/bar/baz');
        parsed.should.have.property('extname', '');
        parsed.should.have.property('basename', 'index');
        parsed.should.have.property('root', '');
      });
    });

    describe('when a dirname is "."', function() {
      it('should preserve the basename', function() {
        var parsed = parsePath('index.js');
        parsed.should.have.property('dirname', '');
        parsed.should.have.property('basename', 'index.js');
        parsed.should.have.property('name', 'index');
        parsed.should.have.property('extname', '.js');
        parsed.should.have.property('root', '');
      });

      it('should parse paths without extensions', function() {
        var parsed = parsePath('foo/bar/baz/index');
        parsed.should.have.property('name', 'index');
        parsed.should.have.property('dirname', 'foo/bar/baz');
        parsed.should.have.property('extname', '');
        parsed.should.have.property('basename', 'index');
        parsed.should.have.property('root', '');
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
}

describe('without native `path.parse` method:', function() {
  var fn;

  before(function() {
    fn = path.parse;
    delete path.parse;
  });

  after(function() {
    path.parse = fn;
  });

  describe('dotfiles', function() {
    it('should get the absolute path:', function() {
      var parsed = parsePath('foo/bar/baz/.dotfile');
      parsed.should.have.property('absolute', path.resolve('foo/bar/baz/.dotfile'));
    });

    it('should specify if a path is absolute:', function() {
      parsePath('foo/bar/baz/.dotfile').isAbsolute.should.be.false;;
      parsePath('/foo/bar/baz/.dotfile').isAbsolute.should.be.true;
    });

    it('should recognize dotfiles', function() {
      var parsed = parsePath('foo/bar/baz/.dotfile');
      parsed.should.have.property('path', 'foo/bar/baz/.dotfile');
      parsed.should.have.property('name', '.dotfile');
      parsed.should.have.property('dirname', 'foo/bar/baz');
      parsed.should.have.property('extname', '');
      parsed.should.have.property('name', '.dotfile');
    });

    it('should recognize .gitignore', function() {
      var parsed = parsePath('./.gitignore');
      parsed.should.have.property('name', '.gitignore');
      parsed.should.have.property('dirname', '.');
      parsed.should.have.property('extname', '');
      parsed.should.have.property('basename', '.gitignore');
      parsed.should.have.property('root', '');
    });

    it('should recognize config files', function() {
      var parsed = parsePath('./.verbfile.md');
      parsed.should.have.property('name', '.verbfile');
      parsed.should.have.property('dirname', '.');
      parsed.should.have.property('extname', '.md');
      parsed.should.have.property('basename', '.verbfile.md');
      parsed.should.have.property('root', '');
    });

    it('should recognize config files', function() {
      var parsed = parsePath('./.travis.yml');
      parsed.should.have.property('name', '.travis');
      parsed.should.have.property('dirname', '.');
      parsed.should.have.property('extname', '.yml');
      parsed.should.have.property('basename', '.travis.yml');
      parsed.should.have.property('root', '');
    });
  });

  describe('when a single segment is passed', function() {
    it('should return the correct values', function() {
      var parsed = parsePath('foo');
      parsed.should.have.property('name', 'foo');
      parsed.should.have.property('dirname', (hasParse ? '' : '.'));
      parsed.should.have.property('extname', '');
      parsed.should.have.property('basename', 'foo');
      parsed.should.have.property('root', '');
    });

    it('should return the correct values', function() {
      var parsed = parsePath('./foo');
      parsed.should.have.property('name', 'foo');
      parsed.should.have.property('dirname', '.');
      parsed.should.have.property('extname', '');
      parsed.should.have.property('basename', 'foo');
      parsed.should.have.property('root', '');
    });
  });

  describe('when a filepath is passed', function() {
    it('should return an object of path parts', function() {
      var parsed = parsePath('foo/bar/baz/index.html');
      parsed.should.have.property('name', 'index');
      parsed.should.have.property('dirname', 'foo/bar/baz');
      parsed.should.have.property('extname', '.html');
      parsed.should.have.property('basename', 'index.html');
      parsed.should.have.property('root', '');
    });

    it('should get the root', function() {
      var parsed = parsePath('/foo/bar/baz/index.html');
      parsed.should.have.property('name', 'index');
      parsed.should.have.property('dirname', '/foo/bar/baz');
      parsed.should.have.property('extname', '.html');
      parsed.should.have.property('basename', 'index.html');
      parsed.should.have.property('root', (hasParse ? '/' : ''));
    });
  });

  describe('when a filepath ends with a slash', function() {
    it('dirname should be the full filepath, and basename should be empty', function() {
      var parsed = parsePath('foo/bar/baz/quux/');
      parsed.should.have.property('name', 'quux');
      parsed.should.have.property('dirname', 'foo/bar/baz');
      parsed.should.have.property('extname', '');
      parsed.should.have.property('basename', 'quux');
      parsed.should.have.property('root', '');
    });
  });

  describe('when a filepath with multiple extensions is passed', function() {
    it('should return an object of path parts', function() {
      var parsed = parsePath('foo/bar/baz/index.md.html');
      parsed.should.have.property('name', 'index.md');
      parsed.should.have.property('dirname', 'foo/bar/baz');
      parsed.should.have.property('extname', '.html');
      parsed.should.have.property('basename', 'index.md.html');
      parsed.should.have.property('root', '');
    });
  });

  describe('when a filepath with zero extensions is passed', function() {
    it('should return an object of path parts', function() {
      var parsed = parsePath('foo/bar/baz/index');
      parsed.should.have.property('name', 'index');
      parsed.should.have.property('dirname', 'foo/bar/baz');
      parsed.should.have.property('extname', '');
      parsed.should.have.property('basename', 'index');
      parsed.should.have.property('root', '');
    });
  });

  describe('when a dirname is "."', function() {
    it('should preserve the basename', function() {
      var parsed = parsePath('index.js');
      parsed.should.have.property('dirname', (hasParse ? '' : '.'));
      parsed.should.have.property('basename', 'index.js');
      parsed.should.have.property('name', 'index');
      parsed.should.have.property('extname', '.js');
      parsed.should.have.property('root', '');
    });

    it('should parse paths without extensions', function() {
      var parsed = parsePath('foo/bar/baz/index');
      parsed.should.have.property('name', 'index');
      parsed.should.have.property('dirname', 'foo/bar/baz');
      parsed.should.have.property('extname', '');
      parsed.should.have.property('basename', 'index');
      parsed.should.have.property('root', '');
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
