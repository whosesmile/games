var app = angular.module('app', ['ngResource', 'ui.router', 'ui.bootstrap']);

// 关闭SCE
app.config(function ($sceProvider) {
  $sceProvider.enabled(false);
});

// HTTP拦截器
app.config(function ($httpProvider) {

  $httpProvider.defaults.transformResponse.push(function (res) {
    if (res && res.code === 200) {
      return res.data;
    }
    return res;
  });

  // Add interceptor
  // $httpProvider.interceptors.push(function ($q) {
  //   return {
  //     response: function (response) {
  //       if (angular.isObject(response.data)) {
  //         var res = response.data;

  //         // 约定的未登录状态码
  //         if (res.code === 401) {
  //           return $q.reject({
  //             message: '会话过期，请重新登录！'
  //           });
  //         }

  //         // 约定的没权限
  //         if (res.code === 403) {
  //           return $q.reject({
  //             message: '你无权进行相关操作'
  //           });
  //         }

  //         // 默认自动拆包
  //         if (response.config.autoparse !== false) {
  //           return [0, 200].indexOf(res.code) !== -1 ? $q.when(res.data) : $q.reject(res.data);
  //         }

  //         return $q.when(response.data);
  //       }
  //       return $q.when(response);
  //     }
  //   };
  // });
});

// 常量 - 推荐位置
app.constant('CONS_PLACES', [{
  name: '首页',
  value: 'home'
}]);

// 声明路由
app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: 'home.html',
      controller: 'homeController'
    })
    .state('type', {
      url: "/type",
      templateUrl: 'type.html',
      controller: 'typeController'
    })
    .state('list', {
      url: "/list",
      templateUrl: 'list.html',
      controller: 'listController'
    })
    .state('game', {
      url: "/game",
      templateUrl: 'game.html',
      controller: 'gameController'
    })
    .state('ugame', {
      url: "/game/:id",
      templateUrl: 'game.html',
      controller: 'gameController'
    })
    .state('news', {
      url: "/news",
      templateUrl: 'news.html',
      controller: 'newsController'
    })
    .state('lamp', {
      url: "/lamp",
      templateUrl: 'lamp.html',
      controller: 'lampController'
    });
});