var fs = require('fs');
var path = require('path');
var request = require('request');
var storage = require('./storage');
var orm = require('../helper/model');

var list = [];
var index = 0;

// 下载图片
var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// 转存七牛
function process(url) {
  var dest = '/Users/smilelegend/workstation/legend/upload/' + (Math.random() + '').substring(2) + path.extname(url);
  return new Promise(function (resolve, reject) {
    download(url, dest, function () {
      storage.upload(path.basename(url), dest).then(function (uri) {
        fs.unlink(dest);
        resolve(uri);
      });
    });
  });
}

function next(game) {
  if (!game) {
    return;
  }
  // 处理LOGO
  process(game.logo).then(function (logo) {
    game.logo = logo;

    var asyncs = game.pictures.map(function (item) {
      return process(item);
    });

    // 处理配图
    return Promise.all(asyncs).then(function (pictures) {
      game.pictures = pictures;
      game.save().then(function () {
        setTimeout(function () {
          next(list[++index]);
        }, 3000);
      });
    });
  });
}

// 查找需要转存的数据
orm.proxy.game.find({
  where: {
    logo: {
      $like: 'http://m.25az.com/%'
    }
  }
}).then(function (data) {
  list = data.reverse();
  next(list[index]);
});
