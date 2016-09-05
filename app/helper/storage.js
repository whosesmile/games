var fs = require('fs');
var path = require('path');
var qiniu = require("qiniu");
var crypto = require('crypto');
var logger = require('./logger');

// 七牛公开空间
var qnconfig = {
  bucket: 'legend',
  domain: 'http://oba26vm79.bkt.clouddn.com/',
  access_key: 'thmRnsH3NxrfDgPrVTbJXtjEC25OhLVMQlS9traW',
  secret_key: 'Pu-p4MPd7sFDWFIqYKGouvNEtx1t8zNIIU6XUueX',
};

// 配置七牛的秘钥
qiniu.conf.ACCESS_KEY = qnconfig.access_key;
qiniu.conf.SECRET_KEY = qnconfig.secret_key;

// 构建七牛上传TOKEN
function uptoken(key) {
  var putPolicy = new qiniu.rs.PutPolicy(qnconfig.bucket + ":" + key);
  return putPolicy.token();
}

module.exports = {

  // 七牛上传
  upload: function (name, image) {
    return new Promise(function (resolve, reject) {
      var extra = new qiniu.io.PutExtra();
      var key = crypto.createHash('md5').update(fs.readFileSync(image)).digest('hex') + path.extname(name);
      qiniu.io.putFile(uptoken(key), key, image, extra, function (err, data) {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        else {
          return resolve(qnconfig.domain + data.key);
        }
      });

    });
  },

};
