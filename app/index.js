import 'babel-polyfill';
import _ from 'lodash';
import Koa from 'koa';
import path from 'path';
import nunjucks from 'nunjucks';
import helper from './helper';
import config from './config';
import assets from 'koa-static-cache';
import favicon from './helper/favicon';
import filters from './helper/filters';
import minify from './helper/minify';
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
    // JSON
    if (_.isNumber(args[0])) {
      let [code, data] = [args[0], {}];

      // 快捷消息模式
      if (!_.isObject(args[1])) {
        data.message = args[1];
      }

      return {
        code: code,
        data: _.merge(...[data, ...args.slice(1)]),
      };
    }

    // HTML
    return env.render(...args);
  };
  await next();
});

// minify html
app.use(minify({
  minifyJS: true,
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  processScripts: []
}));

// import modules
helper.walk(path.join(__dirname, 'modules')).forEach(function (path) {
  var router = require(path);
  if (typeof router.routes === 'function') {
    app.use(router.routes()).use(router.allowedMethods());
  }
});

app.listen(config.port, () => console.log('\nServer started on port:', config.port, '\n'));
