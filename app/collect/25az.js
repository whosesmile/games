var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var request = require('request-promise');
var orm = require('../helper/model');

var page = 1;
var maxp = 3;
var categories = null;

function listCategory() {
  return orm.proxy.category.list();
}

// 爱吾安卓游戏
// http://www.25az.com/

function findGame(id) {
  return orm.proxy.game.find({
    where: {
      remark: 'az#' + id
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
    game.setCategories(categories);
    game.save();
    return loadGames(list, ++index);
  }, function () {
    console.log('加载失败 重复尝试');
    return loadGames(list, index);
  });
}

function loadGame(id) {
  return findGame(id).then(function (game) {
    console.log('\n\n\n正在抓取爱吾安卓游戏:' + id);
    return request({
      url: 'http://www.25az.com/Android/View/' + id + '/',
      timeout: 3000
    }).then(function (html) {
      var $ = cheerio.load(html);
      var nodes = $('.content_nav_header').next();
      game = _.merge(game, {
        name: $('h1').eq(0).text().trim(),
        logo: $('.app-img').eq(0).find('img').attr('src'),
        size: parseFloat($('dd').eq(1).text().trim()),
        brief: (nodes.filter(function (index, item) {
          return item.attribs.style === 'color: #FF6600;';
        }).eq(0).text() || '精彩纷呈,等你来战,传奇你我,游戏人生！').replace(/[\r\n]/g, '').trim(),
        describe: '<p>' + nodes.filter(function (index, item) {
          return item.attribs.style === 'color: #5b9921;';
        }).eq(0).text().trim().replace(/(<([^>]+)>)/ig, '').split(/[\n\r]/).map(function (item) {
          return item.trim();
        }).filter(function (item) {
          return item.length;
        }).join('</p><p>') + '</p>',
        score: 4,
        pictures: Array.from($('.img_screen li a').map(function () {
          return $(this).attr('href')
        })),
        remark: 'az#' + id,
        android: $('.app_down').find('a').eq(1).attr('href').substring($('.app_down').find('a').eq(1).attr('href').indexOf('?') + 1),
      });
      return orm.proxy.game.save(game);
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
      return ['联网', '变态'].indexOf(item.name) !== -1;
    });
    if (page > maxp) {
      return false;
    }
    console.log('正在抓取爱吾安卓游戏列表：第' + page + '页');
    return request('http://www.25az.com/android/Sort/BT/hack/0/' + page).then(function (html) {
      var $ = cheerio.load(html);
      var list = [];
      $('.app_list > li').each(function (index, item) {
        var id = $(this).find('p a').attr('href').split('/')[3];
        list.push(id);
      });

      return loadGames(list);
    });
  });
}

// 只追加游戏
function insertGames() {
  listCategory().then(function (data) {
    categories = data.list.filter(function (item) {
      return ['联网', '变态'].indexOf(item.name) !== -1;
    });
    if (page > maxp) {
      return false;
    }
    console.log('正在抓取爱吾安卓游戏列表：第' + page + '页');
    return request('http://www.25az.com/android/Sort/BT/hack/0/' + page).then(function (html) {
      var $ = cheerio.load(html);
      var list = [];
      $('.app_list > li').each(function (index, item) {
        var id = $(this).find('p a').attr('href').split('/')[3];
        list.push(id);
      });

      return appendGames(list);
    });
  });
}

insertGames();
