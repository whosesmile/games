import 'babel-polyfill';
import _ from 'lodash';
import Koa from 'koa';
import path from 'path';
import nunjucks from 'nunjucks';
import parser from 'koa-body';
import helper from './helper';
import config from './config';
import assets from 'koa-static-cache';
import favicon from './helper/favicon';
import filters from './helper/filters';
import minify from './helper/minify';
import logger from './helper/logger';

// init koa 2.0
const app = module.exports = new Koa();

// config template
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('app', {
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
  ctx.render = function (name, ...args) {
    // JSON
    if (_.isNumber(name)) {
      let [code, data] = [name, {}];

      // 快捷消息模式
      if (!_.isObject(args[0])) {
        data.message = args[0];
      }
      return {
        code: code,
        data: _.defaults(data, ...args.reverse()),
      };
    }

    // HTML
    var module = path.dirname(helper.callsite()[6].getFileName());
    var abspath = path.resolve(module, name);
    // if not relative path and not repeat config view folder also, auto add view folder
    if (!name.startsWith('.') && !name.startsWith(config.views)) {
      abspath = path.resolve(module, config.views, name);
    }

    env.render(...[abspath, ...args]);
    return env.render(...[abspath, ...args]);
  };
  await next();
});

// error handler
app.use(async(ctx, next) => {
  console.time('z');
  try {
    await next();
  }
  catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    logger.error(ctx.status, ctx.url, ctx.method, ctx.headers, err);
    ctx.body = ctx.render('./views/500.html');
  }
  finally {
    if (ctx.status === 403) {
      logger.error(ctx.status, ctx.url);
      ctx.body = ctx.render('./views/403.html');
    }
    else if (ctx.status === 404) {
      logger.error(ctx.status, ctx.url);
      ctx.body = ctx.render('./views/404.html');
    }
  }
  console.timeEnd('z');
});

// minify html
app.use(minify({
  minifyJS: {
    mangle: false
  },
  minifyCSS: true,
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  processScripts: []
}));

// parse form
app.use(parser({
  strict: false,
  jsonLimit: 1024 * 1024 * 2, // 2MB
  formLimit: 1024 * 1024 * 2, // 2MB
  textLimit: 1024 * 1024 * 2, // 2MB
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../upload')
  }
}));

// import modules
helper.walk(path.join(__dirname, 'modules')).forEach(function (path) {
  var router = require(path);
  if (typeof router.routes === 'function') {
    app.use(router.routes()).use(router.allowedMethods());
  }
});

app.listen(config.port, () => logger.info('\nServer started on port:', config.port, '\n'));
