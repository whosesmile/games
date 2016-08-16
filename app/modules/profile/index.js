import Router from 'koa-router';

var router = module.exports = new Router({
  prefix: '/profile'
});

// profile
router.get('/', async(ctx, next) => {
  ctx.body = ctx.render('index.html');
});
