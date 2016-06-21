'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _ = require('.');

var _2 = _interopRequireDefault(_);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _nunjucks2.default.FileSystemLoader.extend({
  getSource: function getSource(name) {
    // callsite for dynamic calculate template path
    // helper.callsite().forEach(function(obj) {
    //   console.log('****', obj.getFileName())
    // });
    var module = _path2.default.dirname(_2.default.callsite()[7].getFileName());
    var abspath = _path2.default.resolve(module, name);
    if (!name.startsWith('.') && !name.startsWith(_config2.default.views)) {
      abspath = _path2.default.resolve(module, _config2.default.views, name);
    }

    if (!abspath) {
      return null;
    }

    // cache template
    this.pathsToNames[abspath] = name;

    return {
      src: _fs2.default.readFileSync(abspath, 'utf-8'),
      path: abspath,
      noCache: this.noCache
    };
  }
});