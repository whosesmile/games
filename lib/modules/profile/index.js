'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = module.exports = new _koaRouter2.default({
  prefix: '/profile'
});

// profile
router.get('/', function (ctx, next) {
  ctx.body = ctx.render('index.html');
});

// profile
router.get('/test', function (ctx, next) {
  ctx.body = ctx.render('test.html');
});