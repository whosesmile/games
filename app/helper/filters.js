import fs from 'fs';
import path from 'path';
import moment from 'moment';
import util from 'util';
import crypto from 'crypto';
import config from '../config';
import orm from './model';

// 版本缓存
var versions = {};

// 根据路径计算文件实际存储位置
function abspath(input) {
  return path.join(config.assets, String(input).replace('/assets/', ''));
}

module.exports = function (env) {

  // theme: load from db
  orm.proxy.theme.all().then(function (list) {
    env.addFilter('theme', function (id) {
      var theme = list.filter(function (item) {
        return item.id == id;
      })[0];
      return theme ? theme.name : '未知';
    });
  });

  // type: load from db
  orm.proxy.type.all().then(function (list) {
    env.addFilter('type', function (id) {
      var type = list.filter(function (item) {
        return item.id == id;
      })[0];
      return type ? type.name : '未知';
    });
  });

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
      var extname;
      var file = abspath(input);
      try {
        var text = fs.readFileSync(file).toString();
        var version = crypto.createHash('md5').update(text).digest('hex').substring(0, 8).toUpperCase();
        extname = path.extname(file);
        // 需要配合静态路径重写路由
        versions[input] = util.format('%s/%s-$%s$%s', path.dirname(input), path.basename(input, extname), version, extname);
      }
      catch (e) {
        extname = path.extname(input);
        versions[input] = util.format('%s/%s-$%s$%s', path.dirname(input), path.basename(input, extname), String(Date.now()).substring(0, 8), extname);
      }
    }

    return versions[input];
  });

  // remove HTML attr like: (style, class, width, height)
  env.addFilter('rmattr', function (content) {
    return content.replace(/\s?(style|class|width|height)=".+?"/g, '');
  });

  // remove HTML tag
  env.addFilter('rmhtml', function (content) {
    return content.replace(/(<([^>]+)>)/ig, '');
  });

  // merge
  env.addFilter('assign', function (...args) {
    return Object.assign({}, ...args);
  });

  // date
  env.addFilter('date', function (time, format) {
    return time ? moment(time).format(format) : null;
  });

  // split
  env.addFilter('split', function (str, symbols) {
    return str ? str.split(symbols || /[\s,]/).filter(function (item) {
      return item.trim().length > 0;
    }) : [];
  });

  // 七牛缩略图服务
  env.addFilter('thumb', function (uri, width, height) {
    if (uri && uri.indexOf('?') === -1) {
      uri = uri + '?imageView2/2/w/' + width + '/h/' + height;
    }
    return uri;
  });
};
