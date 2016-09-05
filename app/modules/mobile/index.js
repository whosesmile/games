import Router from 'koa-router';
import orm from '../../helper/model';
var router = module.exports = new Router({
  prefix: '/mobile'
});

// index
router.get('/', async(ctx, next) => {
  var types = await orm.proxy.type.list(1, 5);
  var leads = await orm.proxy.game.list(1, 3, {
    where: {
      status: true,
    },
    order: [
      ['updatedAt', 'desc'],
      ['createdAt', 'desc'],
    ],
  });
  var ranks = await orm.proxy.game.list(1, 20, {
    where: {
      status: true,
    }
  });
  var banners = await orm.proxy.banner.list(1, 5, {
    where: {
      status: true,
    },
  });
  ctx.body = ctx.render('index.html', {
    types: types.list,
    leads: leads.list,
    ranks: ranks.list,
    banners: banners.list,
  });
});

// all games
router.get('/games', async(ctx, next) => {
  var list = await orm.proxy.game.list(1, 20, {
    where: {
      status: true,
    }
  });

  ctx.body = ctx.render('games.html', {
    list: list.list,
  });
});

// games by type
router.get('/games/:type', async(ctx, next) => {
  var type = await orm.proxy.type.get(ctx.params.type);
  var list = await orm.proxy.game.list(1, 20, {
    where: {
      status: true,
      typeId: ctx.params.type,
    }
  });

  ctx.body = ctx.render('games.html', {
    type: type,
    list: list.list,
  });
});

// details
router.get('/game/:id', async(ctx, next) => {
  var game = await orm.proxy.game.get(ctx.params.id);
  var near = await orm.proxy.game.random(3, {
    where: {
      status: true,
      id: {
        $ne: ctx.params.id
      }
    }
  });
  ctx.body = ctx.render('game.html', {
    game: game,
    near: near,
  });
});

// score
router.get('/score/:id', async(ctx, next) => {
  var game = await orm.proxy.game.get(ctx.params.id);
  ctx.body = ctx.render('score.html', {
    game: game,
  });
});

// ajax
router.get('/games/ajax/list', async(ctx, next) => {
  var where = {
    status: true
  };
  if (ctx.query.type) {
    where.typeId = ctx.query.type;
  }
  var data = await orm.proxy.game.list(ctx.query.page, ctx.query.size, {
    where: where
  });
  ctx.body = ctx.render(200, data);
});
