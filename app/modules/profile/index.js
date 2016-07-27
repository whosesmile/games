import Router from 'koa-router';

var router = module.exports = new Router({
  prefix: '/profile'
});

// profile
router.get('/', async(ctx, next) => {
  ctx.body = await ctx.render('index.html');
});
