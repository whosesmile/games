import Router from 'koa-router';
import orm from '../../helper/model';
import crypto from 'crypto';

var router = module.exports = new Router({
  prefix: '/admin'
});

// index
router.get('/', cacheDisabled, adminRequired, async(ctx, next) => {
  ctx.body = ctx.render('index.html', {
    admin: ctx.session.admin
  });
});

// login
router.get('/login', cacheDisabled, async(ctx, next) => {
  ctx.body = ctx.render('login.html');
});

// logout
router.get('/logout', async(ctx, next) => {
  ctx.session = null;
  ctx.redirect('/admin/login');
});

// login
router.post('/login', async(ctx, next) => {
  var form = ctx.request.body;
  var admin = await orm.proxy.admin.find({
    where: {
      status: true,
      account: form.account,
      password: crypto.createHash('sha512').update(form.password).digest('hex'),
    }
  });
  if (admin.length === 0) {
    return ctx.body = ctx.render('login.html', {
      error: '账户密码不匹配'
    });
  }
  ctx.session.admin = admin[0];
  ctx.redirect('/admin');
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

// get type
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

// get game
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

/* 推荐 */

// list banner
router.get('/ajax/banner', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.banner.list(ctx.query.page, ctx.query.size);
  return ctx.body = ctx.render(200, data);
});

// save banner
router.post('/ajax/banner', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy.banner.save(form);
  return ctx.body = ctx.render(200, data);
});

// delete banner
router.delete('/ajax/banner/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.banner.delete(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// get banner
router.get('/ajax/banner/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy.banner.get(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// save banner
router.post('/ajax/banner/:id', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy.banner.save(form);
  return ctx.body = ctx.render(200, data);
});
