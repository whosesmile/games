'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 版本缓存
var versions = {};

// 根据路径计算文件实际存储位置
function abspath(input) {
  return _path2.default.join(_config2.default.assets, String(input).replace('/assets/', ''));
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
      var extname;
      var file = abspath(input);
      try {
        var text = _fs2.default.readFileSync(file).toString();
        var version = _crypto2.default.createHash('md5').update(text).digest('hex').substring(0, 8).toUpperCase();
        extname = _path2.default.extname(file);
        // 需要配合静态路径重写路由
        versions[input] = _util2.default.format('%s/%s-$%s$%s', _path2.default.dirname(input), _path2.default.basename(input, extname), version, extname);
      } catch (e) {
        extname = _path2.default.extname(input);
        versions[input] = _util2.default.format('%s/%s-$%s$%s', _path2.default.dirname(input), _path2.default.basename(input, extname), String(Date.now()).substring(0, 8), extname);
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
};