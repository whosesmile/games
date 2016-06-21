import 'babel-polyfill';
import Koa from 'koa';
import path from 'path';
import nunjucks from 'nunjucks';
import helper from './helper';
import config from './config';
import assets from 'koa-static-cache';
import favicon from './helper/favicon';
import filters from './helper/filters';
import SmartLoader from './helper/loader';

// init koa 2.0
const app = module.exports = new Koa();

// config template
const env = new nunjucks.Environment(new SmartLoader('app', {
  watch: config.watch,
}));

// add filters to env
filters(env);

// config template global context
env.addGlobal('layout', '../../../views/layout.html');
env.addGlobal('macro', '../../../views/macro.html');

// handle favicon
app.use(favicon(config.favicon));

// assets files
app.use(async(ctx, next) => {
  // remove version suffix
  if (ctx.path.startsWith('/assets/')) {
    ctx.path = ctx.path.replace(/-\$[\d\w]+\$/i, '');
  }
  await next();
}).use(assets(config.assets, {
  gzip: true,
  prefix: '/assets',
  maxAge: 365 * 24 * 60 * 60,
}));

// in webview (weixin)
app.use(async(ctx, next) => {
  var headers = ctx.headers || {};
  var userAgent = (headers['user-agent'] || '').toLowerCase();

  ctx.nested = userAgent.includes('micromessenger');
  ctx.isAjax = headers['x-requested-with'] === 'XMLHttpRequest';
  env.addGlobal('nested', ctx.nested);

  await next();
});

// inject render method
app.use(async(ctx, next) => {
  ctx.render = function (...args) {
    return ctx.body = env.render(...args);
  };
  await next();
});

// import modules
helper.walk(path.join(__dirname, 'modules')).forEach(function (path) {
  var router = require(path);
  if (typeof router.routes === 'function') {
    app.use(router.routes()).use(router.allowedMethods());
  }
});

app.listen(3000, () => console.log('server started 3000'));
