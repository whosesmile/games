import Router from 'koa-router';

var router = module.exports = new Router();

// index
router.get('/', async(ctx, next) => {
  await ctx.render('index.html');
});

// games
router.get('/games', async(ctx, next) => {
  await ctx.render('games.html');
});