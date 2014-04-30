'use strict';

var path = require('path');

module.exports = function filepathObject(filepath, fn) {
  var dir = path.dirname(filepath);
  var base = path.basename(filepath);
  var ext = path.extname(filepath);
  var name = path.basename(filepath, ext);

  return {
    filepath: filepath,
    dir: dir,
    dirname: dir,
    filename: base,
    basename: base,
    name: name,
    ext: ext,
    extname: ext,
    fn: (fn && typeof fn === 'function') ? fn(filepath) : ''
  };
};