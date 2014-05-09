'use strict';

var path = require('path');

function addDot(str) {
  return '.' + str;
}

function compact(arr) {
  return arr.filter(Boolean);
}

function strip(str) {
  return str.replace(/^\/|\/$/g, '');
}

function isDotfile(str) {
  return /^\./.test(str.split('/').reverse()[0]);
}

module.exports = function(filepath) {
  // normalize slashes
  filepath = filepath.replace(/\\/g, '/');
  var dirname = path.dirname(filepath);

  var basename = filepath.replace(dirname, '');
  var name = basename.split('.')[0];
  var extname = basename.replace(name, '');

  if (isDotfile(filepath)) {
    basename = extname;
    name = basename;
    extname = '';
  }

  // create an array of extensions. useful if more than one extension exists
  var segments = compact(extname.split('.')).map(addDot);

  return {
    basename: strip(basename),
    dirname: dirname,
    extname: extname,
    name: strip(name),
    extSegments: segments
  };
};


var str = 'foo/bar/.dotfile';
console.log(path.basename(str, path.extname(str)));