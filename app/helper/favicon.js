import fs from 'fs';
import path from 'path';

function readFile(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

/**
 * Serve favicon.ico
 *
 * @param {String} path
 * @param {Object} [options]
 * @return {Function}
 */

module.exports = function (fav, options) {
  fav = path.resolve(fav);
  options = options || {};

  var maxAge = options.maxAge == null ? 86400000 : Math.min(Math.max(0, options.maxAge), 31556926000);

  return async(ctx, next) => {
    if ('/favicon.ico' !== ctx.path) {
      return await next();
    };

    if (!fav) return;

    if ('GET' !== ctx.method && 'HEAD' !== ctx.method) {
      ctx.status = 'OPTIONS' == ctx.method ? 200 : 405;
      ctx.set('Allow', 'GET, HEAD, OPTIONS');
      return;
    }

    ctx.set('Cache-Control', 'public, max-age=' + (maxAge / 1000 | 0));
    ctx.type = 'image/x-icon';
    ctx.body = await readFile(fav);
  };
};
