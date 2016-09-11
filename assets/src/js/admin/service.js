// 服务模板
app.factory('Mixin', function ($uibModal, $state) {
  return function (scope, proxy, templ, values) {
    // PAGE参数
    scope.page = scope.page || $state.params.page;

    // 查询参数
    scope.params = scope.params || {};

    // 列表
    scope.query = function () {
      scope.list = null;
      proxy.list(angular.extend({}, scope.params, {
        page: scope.page || 1
      }), function (data) {
        Object.assign(scope, data);
      });
    };

    // 自动翻页
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

// 类别
app.factory('Category', function ($resource) {
  return $resource('/admin/ajax/category/:id', {}, {
    list: {
      isArray: false,
      method: 'get',
    }
  });
});

// 题材
app.factory('Theme', function ($resource) {
  return $resource('/admin/ajax/theme/:id', {}, {
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

// 账户
app.factory('Admin', function ($resource) {
  return $resource('/admin/ajax/admin/:id', {}, {
    list: {
      isArray: false,
      method: 'get',
    }
  });
});
