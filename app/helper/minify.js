import { minify } from 'html-minifier';

module.exports = function (options) {
  options = options || {};
  return async(ctx, next) => {
    await next();

    if (!ctx.response.is('html')) {
      return;
    }
    var body = ctx.body;
    if (!body) {
      return;
    }

    // too lazy to handle streams
    if (typeof body.pipe === 'function') {
      return;
    }
    if (Buffer.isBuffer(body)) {
      body = body.toString('utf8');
    }
    else if (typeof body === 'object') {
      return; // wtf programming
    }
    ctx.body = minify(body, options);
  };
};
