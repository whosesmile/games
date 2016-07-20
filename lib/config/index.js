'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {

  // view folder
  views: 'templates',

  // watch tempalte change
  watch: true,

  // favicon
  favicon: _path2.default.resolve(__dirname, '../favicon.ico'),

  // assets file
  assets: _path2.default.join(__dirname, '../../assets/.tmp')
};