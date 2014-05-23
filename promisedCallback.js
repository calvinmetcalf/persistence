'use strict';
module.exports = function (promise, callback) {
  if (!callback) {
    return promise;
  }
  promise.then(function (resp){
    process.nextTick(function () {
      callback(null, resp);
    });
  }, function (e) {
    process.nextTick(function () {
      callback(e);

    });
  });
  return promise;
};