var config = require('./app/config');

// 开发环境
if (config.watch) {
  require('babel-register');
  require('./app');
}
// 生产环境
else {
  require('./lib');
}
