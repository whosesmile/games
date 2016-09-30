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
  // 转换成数字 便于计算
  Object.keys(ctx.params).map(function (key) {
    ctx.params[key] = parseInt(ctx.params[key], 10);
  });

  var params = ctx.params;
  var size = 24;
  var page = params.page;
  var include = [];
  var where = {
    status: true,
  };

  var types = await orm.proxy.type.all();
  var themes = await orm.proxy.theme.all();
  var categories = await orm.proxy.category.all();

  // 类型
  if (params.category) {
    include = [{
      model: orm.sequelize.models.category,
      attributes: ['id'],
      where: {
        id: params.category,
      }
    }];
  }

  // 品类
  if (params.type) {
    where.typeId = params.type;
  }

  // 提测
  if (params.theme) {
    where.themeId = params.theme;
  }

  var order = [
    ['sort', 'desc'],
    ['score', 'desc'],
    ['createdAt', 'desc']
  ][params.sort] || ['sort', 'desc'];

  // 查询
  var data = await orm.sequelize.models.game.findAndCountAll({
    attributes: ['id', 'name', 'logo', 'size', 'brief', 'sort', 'score', 'typeId', 'themeId', 'updatedAt', 'createdAt'],
    offset: size * (page - 1),
    limit: size,
    where: where,
    include: include,
    order: [order, ['id', 'desc']],
    subQuery: false,
  });

  ctx.body = ctx.render('games.html', {
    list: data.rows,
    count: data.count,
    page: page,
    size: size,
    nums: Math.floor((data.count - 1) / size + 1) || 1,
    types: types,
    themes: themes,
    categories: categories,
    params: params,
  });
});
