'use strict';

var path = require('path');

function strip(str) {
  return str.replace(/^\/|\/$/g, '');
}

function isDotfile(str) {
  return /^\./.test(str.split('/').reverse()[0]);
}

module.exports = function(filepath) {
  filepath = filepath.replace(/\\/g, '/');
  var dirname = path.dirname(filepath);

  var basename = path.basename(filepath);
  if (dirname !== '.') {
    basename = filepath.replace(dirname, '');
  }

  var name = basename.split('.')[0];
  var extname = basename.replace(name, '');

  if (isDotfile(filepath)) {
    basename = extname;
    name = basename;
    extname = '';
  }

  // create an array of extensions. useful if more than one extension exists
  var segments = extname.split('.').filter(Boolean);

  var parts = {
    dirname    : dirname,
    basename   : strip(basename),
    name       : strip(name),
    extname    : extname,
    extSegments: segments.map(function(str) {
      return '.' + str;
    })
  };
  return parts;
};