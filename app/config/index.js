var fs = require('fs');
var path = require('path');
var env = {};

try {
  env = require('../../config');
}
catch (e) {
  console.log('使用生产环境');
}

module.exports = {
  // port
  port: 3700,

  // log file
  logger: {
    error: '/var/log/legend/error.log'
  },

  // view folder
  views: 'templates',

  // favicon
  favicon: path.resolve(__dirname, '../favicon.ico'),

  // watch tempalte change
  watch: env.watch || false,

  // static file
  assets: env.assets || path.join(__dirname, '../../assets/dist'),

  // database
  database: {
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password: '123456',
    dbname: 'legend',
    dialect: 'mysql',
  }
};
