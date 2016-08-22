'use strict';

var path = require('path');
var isAbsolute = require('is-absolute');
var pathRoot = require('path-root');
var MapCache = require('map-cache');
var cache = new MapCache();

module.exports = function(filepath) {
  if (typeof filepath !== 'string') {
    throw new TypeError('parse-filepath expects a string');
  }

  if (cache.has(filepath)) {
    return cache.get(filepath);
  }

  var obj = {};
  if (typeof path.parse === 'function') {
    obj = path.parse(filepath);
    obj.extname = obj.ext;
    obj.basename = obj.base;
    obj.dirname = obj.dir;
    obj.stem = obj.name;

  } else {
    defineProp(obj, 'root', function() {
      return pathRoot(this.path);
    });

    defineProp(obj, 'extname', function() {
      return path.extname(filepath);
    });

    defineProp(obj, 'ext', function() {
      return this.extname;
    });

    defineProp(obj, 'name', function() {
      return path.basename(filepath, this.ext);
    });

    defineProp(obj, 'stem', function() {
      return this.name;
    });

    defineProp(obj, 'base', function() {
      return this.name + this.ext;
    });

    defineProp(obj, 'basename', function() {
      return this.base;
    });

    defineProp(obj, 'dir', function() {
      return path.dirname(filepath);
    });

    defineProp(obj, 'dirname', function() {
      return this.dir;
    });
  }

  obj.path = filepath;

  defineProp(obj, 'absolute', function() {
    return path.resolve(this.path);
  });

  defineProp(obj, 'isAbsolute', function() {
    return isAbsolute(this.path);
  });

  cache.set(filepath, obj);
  return obj;
};

function defineProp(obj, prop, fn) {
  var cached;
  Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: true,
    set: function(val) {
      cached = val;
    },
    get: function() {
      return cached || (cached = fn.call(obj));
    }
  });
}
