import fs from 'fs';
import Router from 'koa-router';
import storage from '../../helper/storage';

var router = module.exports = new Router();

// 上传
router.post('/upload', async(ctx, next) => {
  try {
    var list = [];
    var files = ctx.request.body.files;
    for (var name in files) {
      if (files.hasOwnProperty(name)) {
        var group = files[name];
        group = group.constructor === Array ? group : [group];
        for (var i = 0; i < group.length; i++) {
          var file = group[i];
          try {
            if (file.size) {
              var path = await storage.upload(file.name, file.type, file.path);
              list.push(path);
            }
          }
          // 移除本地缓存文件
          finally {
            fs.unlink(file.path);
          }
        }
      }
    }

    ctx.body = ctx.render(200, {
      list: list
    });
  }
  catch (e) {
    ctx.body = ctx.render(400, e);
  }
});
