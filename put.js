'use strict';
var extend = require('extend');
var promisedCallback = require('./promisedCallback');
var Promise = require('./promise');
module.exports = function (name, fun, rev, opts, callback) {
  if (typeof rev === 'object') {
    callback = opts;
    opts = rev;
    rev = null;
  } else if (typeof rev === 'function') {
    callback = rev;
    rev = opts = null;
  } else if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  }
  opts = extend({}, opts || {});

  if (typeof fun === 'function' || typeof fun === 'string') {
    fun = {map : fun};
  }

  var error;

  if (typeof name !== 'string') {
    error = new Error('you must supply a design doc/view name');
    error.name = 'putview_error';
    error.status = 400;
    return promisedCallback(Promise.reject(error), callback);
  } else if (!fun || ['function', 'string'].indexOf(typeof fun.map) === -1) {
    error = new Error('you must supply a map function');
    error.name = 'putview_error';
    error.status = 400;
    return promisedCallback(Promise.reject(error), callback);
  }

  if (typeof fun.map === 'function') {
    fun.map = fun.map.toString();
  }
  if (typeof fun.reduce === 'function') {
    fun.reduce = fun.reduce.toString();
  }

  var parts = name.split('/');
  var designDocName = '_design/' + parts[0];
  var viewName = parts[1];

  var doc = {
    _id : designDocName,
    views : {}
  };
  doc.views[viewName] = fun;
  if (rev) {
    doc._rev = rev;
  }

  return this.put(doc, callback);
};
