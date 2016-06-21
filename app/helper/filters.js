import fs from 'fs';
import path from 'path';
import util from 'util';
import crypto from 'crypto';
import config from '../config';

// 版本缓存
var versions = {};

// 根据路径计算文件实际存储位置
function abspath(input) {
  return path.join(config.assets, String(input).replace('/assets/', ''));
}

module.exports = function (env) {
  // convert px to rem
  env.addFilter('flexible', function (style, base) {
    return env.getFilter('safe')(style.replace(/\b\d+(\.\d+)?px\b(?!(\s*\)|\s*"\]))/ig, function (match) {
      if ('1px' === match.toLowerCase()) {
        return match;
      }
      return parseInt(match) / (base || 32) + 'rem';
    }));
  });

  // static version control to prevent browser cache
  env.addFilter('version', function (input) {
    if (!versions[input]) {
      var file = abspath(input);
      try {
        var text = fs.readFileSync(file).toString();
        var version = crypto.createHash('md5').update(text).digest('hex').substring(0, 8).toUpperCase();
        var extname = path.extname(file);
        // 需要配合静态路径重写路由
        versions[input] = util.format('%s/%s-$%s$%s', path.dirname(input), path.basename(input, extname), version, extname);
      }
      catch (e) {
        var extname = path.extname(input);
        versions[input] = util.format('%s?$%s$%s', input, Date.now(), extname);
      }
    }

    return versions[input];
  });
};
