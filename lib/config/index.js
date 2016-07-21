'use strict';

var fs = require('fs');
var path = require('path');
var env = fs.existsSync('../../config') ? require('../../config') : {};

module.exports = {
  // port
  port: 3700,

  // view folder
  views: 'templates',

  // favicon
  favicon: path.resolve(__dirname, '../favicon.ico'),

  // watch tempalte change
  watch: env.watch || false,

  // static file
  assets: env.assets || path.join(__dirname, '../../assets/dist')
};