'use strict';

var path = require('path');
var endsWith = require('path-ends-with');

module.exports = function parse(fp) {
  if (typeof fp !== 'string') {
    throw new Error('parse-fp expects a string.');
  }

  fp = fp.replace(/\\/g, '/');
  var dirname = path.dirname(fp);
  var basename = path.basename(fp);

  if (endsWith(fp, '/')) {
    dirname = fp;
    basename = '';
  }

  if (dirname !== '.') {
    basename = fp.replace(dirname, '');
  }

  var name = basename.split('.')[0];
  var ext = basename.replace(name, '');

  if (isDotfile(fp)) {
    basename = ext;
    name = basename;
    ext = '';
  }

  // create an array of extensions. useful
  // if more than one extension exists
  var segments = ext.split('.').filter(Boolean);

  var parts = {
    dirname: dirname,
    basename: strip(basename),
    name: strip(name),
    extname: ext,
    extSegments: segments.map(function(str) {
      // add extension dots back
      return '.' + str;
    })
  };
  return parts;
};


function strip(str) {
  return str.replace(/^\/|\/$/g, '');
}

/**
 * Very naive guess at whether or not the file
 * is a dotfile. It may be a directory as well.
 */

function isDotfile(str) {
  return /^\./.test(str.split('/')
    .reverse()[0]);
}