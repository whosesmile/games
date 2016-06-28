import Router from 'koa-router';

var router = module.exports = new Router();

// index
router.get('/', async(ctx, next) => {
  await ctx.render('index.html');
});

// games
router.get('/games/:type', async(ctx, next) => {
  await ctx.render('games.html');
});

// details
router.get('/game/:id', async(ctx, next) => {
  await ctx.render('game.html');
});

// ajax
router.get('/games/ajax/:type', async(ctx, next) => {
  // 延迟模拟
  await new Promise(function (resolve, reject) {
    setTimeout(function() {
      resolve(null)
    }, 300);
  });
  ctx.render(200, {
    list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  });
});
