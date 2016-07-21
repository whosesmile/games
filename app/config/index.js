var fs = require('fs');
var path = require('path');
var env = {};

try {
  require('../../config');
}
catch (e) {
  console.log('使用生产环境');
}

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
  assets: env.assets || path.join(__dirname, '../../assets/dist'),
};
