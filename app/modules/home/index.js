import Router from 'koa-router';
import orm from '../../helper/model';

var router = module.exports = new Router();

// home
router.get('/', async(ctx, next) => {
  var grapes = await orm.proxy.banner.list(1, 4, {
    where: {
      status: true,
      place: 'grape',
    },
  });
  var cherries = await orm.proxy.banner.list(1, 4, {
    where: {
      status: true,
      place: 'cherry',
    },
  });
  var games = await orm.proxy.game.list(1, 30, {
    where: {
      status: true,
    }
  });
  ctx.body = ctx.render('index.html', {
    grapes: grapes,
    cherries: cherries,
    games: games,
  });
});

// game
router.get('/game/:id', async(ctx, next) => {
  var game = await orm.proxy.game.get(ctx.params.id);
  // 边栏推荐
  var side = await orm.proxy.game.random(6, {
    where: {
      status: true,
      id: {
        $ne: ctx.params.id
      }
    }
  });
  // 底部推荐
  var near = await orm.proxy.game.random(10, {
    where: {
      status: true,
      id: {
        $ne: ctx.params.id
      }
    }
  });
  ctx.body = ctx.render('game.html', {
    game: game,
    side: side,
    near: near,
  });
});

// games
router.get('/games/:page-:sort-:category-:type-:theme', async(ctx, next) => {
  var types = await orm.proxy.type.all();
  var themes = await orm.proxy.theme.all();
  var categories = await orm.proxy.category.all();
  var games = await orm.proxy.game.list(ctx.params.page, 24, {
    where: {
      status: true,
    }
  });
  ctx.body = ctx.render('games.html', games, {
    params: ctx.params,
    types: types,
    themes: themes,
    categories: categories,
  });
});
