// 首页
app.controller('homeController', function ($scope) {

});

// 手游分类
app.controller('typeController', function ($scope, Mixin, Type) {
  Mixin($scope, Type, 'partial/type.html');
});

// 手游列表
app.controller('listController', function ($scope, Mixin, Game) {
  Mixin($scope, Game, 'partial/list.html');

  $scope.toggle = function (model) {
    Game.save(Object.assign({}, model, {
      status: !model.status
    }), function (data) {
      model.status = !model.status;
    });
  };
});

// 新增手游
app.controller('gameController', function ($scope, $state, Game, Type) {
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
    });
  }
});

// 新游推荐
app.controller('newsController', function ($scope) {

});

// 精品推荐
app.controller('lampController', function ($scope) {

});
