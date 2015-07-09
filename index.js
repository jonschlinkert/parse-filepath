'use strict';

var path = require('path');
var nativeParse = path.parse;

module.exports = function parse(fp) {
  if (typeof fp !== 'string') {
    throw new Error('parse-filepath expects a string.');
  }

  var res = {};
  var params = {
    base: 'basename',
    dir: 'dirname',
    ext: 'extname',
    name: 'name',
    root: 'root'
  };

  if (typeof nativeParse === 'function') {
    var parsed = nativeParse(fp);
    for (var key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        res[params[key]] = parsed[key];
      }
    }

  } else {
    var ext = path.extname(fp);
    res.name = path.basename(fp, ext);
    res.basename = res.name + res.ext;
    res.extname = path.extname(fp);
    res.dirname = path.dirname(fp);
    res.root = '';
  }
  return res;
};
