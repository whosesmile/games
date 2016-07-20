'use strict';

require('babel-polyfill');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _favicon = require('./helper/favicon');

var _favicon2 = _interopRequireDefault(_favicon);

var _filters = require('./helper/filters');

var _filters2 = _interopRequireDefault(_filters);

var _minify = require('./helper/minify');

var _minify2 = _interopRequireDefault(_minify);

var _loader = require('./helper/loader');

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// init koa 2.0
var app = module.exports = new _koa2.default();

// config template
var env = new _nunjucks2.default.Environment(new _loader2.default('app', {
  watch: _config2.default.watch
}));

// add filters to env
(0, _filters2.default)(env);

// config template global context
env.addGlobal('layout', '../../../views/layout.html');
env.addGlobal('macro', '../../../views/macro.html');

// handle favicon
app.use((0, _favicon2.default)(_config2.default.favicon));

// assets files
app.use(function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // remove version suffix
            if (ctx.path.startsWith('/assets/')) {
              ctx.path = ctx.path.replace(/-\$[\d\w]+\$/i, '');
            }
            _context.next = 3;
            return next();

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
}()).use((0, _koaStaticCache2.default)(_config2.default.assets, {
  gzip: true,
  prefix: '/assets',
  maxAge: 365 * 24 * 60 * 60
}));

// in webview (weixin)
app.use(function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
    var headers, userAgent;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            headers = ctx.headers || {};
            userAgent = (headers['user-agent'] || '').toLowerCase();


            ctx.nested = userAgent.includes('micromessenger');
            ctx.isAjax = headers['x-requested-with'] === 'XMLHttpRequest';
            env.addGlobal('nested', ctx.nested);

            _context2.next = 7;
            return next();

          case 7:
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

// inject render method
app.use(function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ctx.render = function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              // JSON
              if (_lodash2.default.isNumber(args[0])) {
                var code = args[0];
                var data = {};

                // 快捷消息模式

                if (!_lodash2.default.isObject(args[1])) {
                  data.message = args[1];
                }

                return ctx.body = {
                  code: code,
                  data: _lodash2.default.merge.apply(_lodash2.default, [data].concat(_toConsumableArray(args.slice(1))))
                };
              }

              // HTML
              return ctx.body = env.render.apply(env, args);
            };
            _context3.next = 3;
            return next();

          case 3:
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

// minify html
app.use((0, _minify2.default)({
  minifyJS: true,
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  processScripts: []
}));

// import modules
_helper2.default.walk(_path2.default.join(__dirname, 'modules')).forEach(function (path) {
  var router = require(path);
  if (typeof router.routes === 'function') {
    app.use(router.routes()).use(router.allowedMethods());
  }
});

app.listen(3000, function () {
  return console.log('server started 3000');
});