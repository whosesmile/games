import Router from 'koa-router';
import orm from '../../helper/model';

var router = module.exports = new Router({
  prefix: '/admin'
});

// index
router.get('/', adminRequired, async(ctx, next) => {
  ctx.body = ctx.render('index.html');
});

/* 分类 */

// list type
router.get('/ajax/type', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.type.list(ctx.query.page, ctx.query.size);
  return ctx.body = ctx.render(200, data);
});

// save type
router.post('/ajax/type', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy.type.save(form);
  return ctx.body = ctx.render(200, data);
});

// delete type
router.delete('/ajax/type/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.type.delete(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// list type
router.get('/ajax/type/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.type.get(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// save type
router.post('/ajax/type/:id', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy.type.save(form);
  return ctx.body = ctx.render(200, data);
});

/* 游戏 */

// list game
router.get('/ajax/game', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.game.list(ctx.query.page, ctx.query.size);
  return ctx.body = ctx.render(200, data);
});

// save game
router.post('/ajax/game', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy.game.save(form);
  return ctx.body = ctx.render(200, data);
});

// delete game
router.delete('/ajax/game/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.game.delete(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// list game
router.get('/ajax/game/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.game.get(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// save game
router.post('/ajax/game/:id', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy.game.save(form);
  return ctx.body = ctx.render(200, data);
});
