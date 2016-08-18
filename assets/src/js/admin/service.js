// 服务模板
app.factory('Mixin', function ($uibModal) {
  return function (scope, proxy, templ, values) {

    // 列表
    scope.query = function () {
      scope.list = null;
      proxy.list({
        page: scope.page
      }, function (data) {
        Object.assign(scope, data);
      });
    };

    scope.query();

    // 新建
    scope.create = function () {
      var modal = $uibModal.open({
        templateUrl: templ,
        controller: function ($scope) {
          angular.extend($scope, values);
          $scope.confirm = function () {
            proxy.save($scope.model).$promise.then(function (data) {
              scope.list.unshift(data);
            });
            modal.close($scope.model);
          }
        },
      });
    };

    // 编辑
    scope.update = function (model) {
      var modal = $uibModal.open({
        templateUrl: templ,
        controller: function ($scope) {
          angular.extend($scope, values);
          $scope.model = Object.assign({}, model);
          $scope.confirm = function () {
            proxy.save($scope.model).$promise.then(function (data) {
              model = Object.assign(model, $scope.model);
            });
            modal.close($scope.model);
          }
        },
      });
    };

    // 删除
    scope.delete = function (model) {
      var modal = $uibModal.open({
        templateUrl: 'partial/delete.html',
        controller: function ($scope) {
          angular.extend($scope, values);
          $scope.model = model;
          $scope.message = '<b class="text-xl text-danger">你确定要删除这条记录吗？</b>';
          $scope.confirm = function () {
            proxy.delete({
              id: model.id
            }).$promise.then(function (data) {
              scope.list.splice(scope.list.indexOf(model), 1);
            });
            modal.close($scope.model);
          }
        },
      });
    };

    // 上下架
    scope.toggle = function (model) {
      proxy.save(Object.assign({}, model, {
        status: !model.status
      }), function (data) {
        model.status = !model.status;
      });
    };
  };
});

// 推荐
app.factory('Banner', function ($resource) {
  return $resource('/admin/ajax/banner/:id', {}, {
    list: {
      isArray: false,
      method: 'get',
    }
  });
});

// 游戏
app.factory('Game', function ($resource) {
  return $resource('/admin/ajax/game/:id', {}, {
    list: {
      isArray: false,
      method: 'get',
    }
  });
});

// 类型
app.factory('Type', function ($resource) {
  return $resource('/admin/ajax/type/:id', {}, {
    list: {
      isArray: false,
      method: 'get',
    }
  });
});
