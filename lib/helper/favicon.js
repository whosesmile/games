'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function readFile(path) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(path, function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

/**
 * Serve favicon.ico
 *
 * @param {String} path
 * @param {Object} [options]
 * @return {Function}
 */

module.exports = function (fav, options) {
  var _this = this;

  fav = _path2.default.resolve(fav);
  options = options || {};

  var maxAge = options.maxAge === null ? 86400000 : Math.min(Math.max(0, options.maxAge), 31556926000);

  return function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!('/favicon.ico' !== ctx.path)) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return next();

            case 3:
              return _context.abrupt('return', _context.sent);

            case 4:
              if (fav) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:
              if (!('GET' !== ctx.method && 'HEAD' !== ctx.method)) {
                _context.next = 10;
                break;
              }

              ctx.status = 'OPTIONS' == ctx.method ? 200 : 405;
              ctx.set('Allow', 'GET, HEAD, OPTIONS');
              return _context.abrupt('return');

            case 10:

              ctx.set('Cache-Control', 'public, max-age=' + (maxAge / 1000 | 0));
              ctx.type = 'image/x-icon';
              _context.next = 14;
              return readFile(fav);

            case 14:
              ctx.body = _context.sent;

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  }();
};