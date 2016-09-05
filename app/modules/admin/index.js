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

/* ================================================================================ */

/* 定制CRUD */

// save admin
router.post('/ajax/admin', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  if (form.password) {
    form.password = crypto.createHash('sha512').update(form.password).digest('hex');
  }
  var data = await orm.proxy.admin.save(form);
  return ctx.body = ctx.render(200, data);
});

// save game
router.post('/ajax/game', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var game = await orm.proxy.game.save(form);
  var categories = await orm.proxy.category.find({
    where: {
      id: {
        $in: (form.categories || []).map(function (item) {
          return item.id;
        }),
      }
    }
  });
  game.setCategories(categories);
  await game.save();
  return ctx.body = ctx.render(200, game);
});

/* ================================================================================ */

/* 通用CRUD */

// list
router.get('/ajax/:model', adminRequired, async(ctx, next) => {
  var data = await orm.proxy[ctx.params.model].list(ctx.query.page, ctx.query.size);
  return ctx.body = ctx.render(200, data);
});

// delete
router.delete('/ajax/:model/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy[ctx.params.model].delete(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// get
router.get('/ajax/:model/:id', adminRequired, async(ctx, next) => {
  var data = await orm.proxy[ctx.params.model].get(ctx.params.id);
  return ctx.body = ctx.render(200, data);
});

// save
router.post('/ajax/:model', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy[ctx.params.model].save(form);
  return ctx.body = ctx.render(200, data);
});

// update
router.post('/ajax/:model/:id', adminRequired, async(ctx, next) => {
  var form = ctx.request.body;
  var data = await orm.proxy[ctx.params.model].save(form);
  return ctx.body = ctx.render(200, data);
});
