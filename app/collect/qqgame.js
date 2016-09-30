var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request-promise');
var orm = require('../helper/model');

var page = 1;
var maxp = 103;
var categories = null;
var headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36',
};
/** 网游异常
['100006282',
  '100006564',
  '100002151',
  '100002373',
  '100006823',
  '100002156',
  '100002548',
  '100006736',
  '100006352',
  '100006615',
  '100006750',
  '100006617',
  '100002435',
  '100006719',
  '100006689',
  '100006764',
  '200075856',
  '200097134',
  '100006835',
  '100006830',
  '100002567',
  '100006760',
  '200107728',
  '100006854',
  '100006841',
  '200108129',
  '200108121',
  '200107983'
]
**/

var except = [];

function listCategory() {
  return orm.proxy.category.list();
}

// 爱吾安卓游戏
// http://www.25az.com/

function findGame(id) {
  return orm.proxy.game.find({
    where: {
      remark: 'qq#' + id
    }
  }).then(function (list) {
    return list[0] || {};
  });
}

function loadGames(list, index) {
  index = index || 0;
  if (index >= list.length) {
    return syncGames(++page);
  }

  return loadGame(list[index]).then(function (game) {
    return loadGames(list, ++index);
  }, function () {
    except.push(list[index]);
    return loadGames(list, ++index);
  });
}

function loadGame(id) {
  return findGame(id).then(function (game) {
    console.log('\n\n\n正在抓取QQ手游宝游戏:' + id);
    return request({
      url: 'http://g.qq.com/game/' + id + '/detail.shtml',
      headers: headers,
      timeout: 3000
    }).then(function (html) {
      var $ = cheerio.load(html);
      var nodes = $('.content_nav_header').next();
      game = _.merge(game, {
        name: $('h1').text().trim(),
        logo: $('.game-pic img').attr('src'),
        size: $('.game-txt p').eq(2).text().replace(/[^\d.]/g, ''),
        version: $('.game-txt p').eq(3).text().replace(/[^\d.]/g, ''),
        brief: '精彩纷呈,等你来战,传奇你我,游戏人生！',
        describe: '<p>' + $('.col-bd').text().trim().split('\n').map(function (item) {
          return item.replace(/\r/g, '');
        }).filter(function (item) {
          return item.length;
        }).join('</p><p>') + '</p>',
        score: Math.ceil($('.score i').attr('class').replace(/[^\d]/g, '') / 2),
        pictures: Array.from($('.col-bd img').map(function () {
          return $(this).attr('src')
        })),
        remark: 'qq#' + id,
        android: $('.gm-btns a').eq(1).attr('href'),
      });

      return orm.proxy.game.save(game).then(function (game) {
        game.setCategories(categories);
        game.save();
        return game;
      });
    });
  });
}

function appendGames(list, index) {
  index = index || 0;
  if (index >= list.length) {
    return insertGames(++page);
  }

  return findGame(list[index]).then(function (game) {
    if (game.id) {
      console.log('游戏' + game.id + ':' + game.name + '已经存在');
      return appendGames(list, ++index);
    }
    return loadGame(list[index]).then(function (game) {
      game.setCategories(categories);
      game.save();
      return appendGames(list, ++index);
    }, function () {
      console.log('加载失败 重复尝试');
      return loadGames(list, index);
    });
  });
}

// 同步游戏
function syncGames() {
  listCategory().then(function (data) {
    categories = data.list.filter(function (item) {
      return ['单机'].indexOf(item.name) !== -1;
    });
    if (page > maxp) {
      return false;
    }
    console.log('n正在抓取QQ手游宝游戏: 第' + page + '页');
    var url = 'http://g.qq.com/danji/hot.shtml';
    if (page != 1) {
      url = 'http://g.qq.com/danji/hot_' + (page - 1) + '.shtml';
    }
    return request({
      url: url,
      headers: headers,
    }).then(function (html) {
      var $ = cheerio.load(html);
      var list = [];
      $('.mod-gm-list li > a').each(function (index, item) {
        var id = $(this).attr('href').split('/')[2];
        list.push(id);
      });

      return loadGames(list);
    });
  });

  console.log('同步异常游戏：', except)
}

syncGames();
