import Router from 'koa-router';

var router = module.exports = new Router({
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