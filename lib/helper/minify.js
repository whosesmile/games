'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _htmlMinifier = require('html-minifier');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (options) {
  var _this = this;

  options = options || {};
  return function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      var body;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return next();

            case 2:
              if (ctx.response.is('html')) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return');

            case 4:
              body = ctx.body;

              if (body) {
                _context.next = 7;
                break;
              }

              return _context.abrupt('return');

            case 7:
              if (!(typeof body.pipe === 'function')) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return');

            case 9:
              if (!Buffer.isBuffer(body)) {
                _context.next = 13;
                break;
              }

              body = body.toString('utf8');
              _context.next = 15;
              break;

            case 13:
              if (!((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object')) {
                _context.next = 15;
                break;
              }

              return _context.abrupt('return');

            case 15:
              // wtf programming

              ctx.body = (0, _htmlMinifier.minify)(body, options);

            case 16:
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