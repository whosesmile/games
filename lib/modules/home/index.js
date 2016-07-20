'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var router = module.exports = new _koaRouter2.default();

// index
router.get('/', function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return ctx.render('index.html');

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
}());

// games
router.get('/games/:type', function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return ctx.render('games.html');

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return ref.apply(this, arguments);
  };
}());

// details
router.get('/game/:id', function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return ctx.render('game.html');

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return ref.apply(this, arguments);
  };
}());

// score
router.get('/score/:id', function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx, next) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return ctx.render('score.html');

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return ref.apply(this, arguments);
  };
}());

// ajax
router.get('/games/ajax/:type', function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx, next) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                resolve(null);
              }, 300);
            });

          case 2:
            ctx.render(200, {
              list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
            });

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x9, _x10) {
    return ref.apply(this, arguments);
  };
}());