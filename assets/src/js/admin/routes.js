// 首页
app.controller('homeController', function ($scope, Mixin, Banner, Game, CONS_PLACES) {
  Mixin($scope, Banner, 'partial/banner.html', {
    places: CONS_PLACES,
    findGame: function (name) {
      return Game.list({
        page: 1,
        size: 10,
        name: name
      }).$promise.then(function (data) {
        return data.list;
      });
    },
    validGame: function () {
      if (!this.model.game || !this.model.game.id) {
        return this.model.game = null;
      }
    },
  });
});

// 手游类别
app.controller('categoryController', function ($scope, Mixin, Category) {
  Mixin($scope, Category, 'partial/category.html');
});

// 手游题材
app.controller('themeController', function ($scope, Mixin, Theme) {
  Mixin($scope, Theme, 'partial/theme.html');
});

// 手游分类
app.controller('typeController', function ($scope, Mixin, Type) {
  Mixin($scope, Type, 'partial/type.html');
});

// 手游列表
app.controller('listController', function ($scope, $state, Mixin, Game) {
  Mixin($scope, Game, 'partial/list.html');
  $scope.search = function () {
    $scope.page = 1;
    $scope.query();
  };
});

// 新增手游
app.controller('gameController', function ($scope, $state, $window, filterFilter, Game, Category, Type, Theme) {
  // 加载类型
  Category.list({
    size: 100
  }, function (data) {
    $scope.categories = data.list;
  });

  // 加载题材
  Theme.list({
    size: 100
  }, function (data) {
    $scope.themes = data.list;
  });

  // 加载分类
  Type.list({
    size: 100
  }, function (data) {
    $scope.types = data.list;
  });

  $scope.model = {
    sort: 0,
  };

  // 创建
  $scope.create = function () {
    Game.save($scope.model, function (data) {
      $state.go('list');
    });
  };

  // 更新
  if ($state.params.id) {
    Game.get({
      id: $state.params.id
    }, function (data) {
      $scope.model = data;
      var checked = data.categories.map(function (item) {
        return item.id
      });
      $scope.$watch('categories', function () {
        if ($scope.categories) {
          $scope.categories.map(function (item) {
            item.selected = checked.indexOf(item.id) !== -1;
          });
        }
      });
    });
  }

  // 更改类型
  $scope.$watch('categories|filter:{selected:true}', function (checked) {
    if (checked) {
      $scope.model.categories = checked;
    }
  }, true);
});

// 新游推荐
app.controller('newsController', function ($scope) {

});

// 精品推荐
app.controller('lampController', function ($scope) {

});

// 账户管理
app.controller('adminController', function ($scope, Mixin, Admin) {
  Mixin($scope, Admin, 'partial/admin.html');
});
