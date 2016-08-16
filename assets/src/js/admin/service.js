// 服务模板
app.factory('Mixin', function ($uibModal) {
  return function (scope, proxy, templ) {

    scope.$watch('page', function() {
      console.log(scope.page)
    });

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
  };
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

// 游戏
app.factory('Game', function ($resource) {
  return $resource('/admin/ajax/game/:id', {}, {
    list: {
      isArray: false,
      method: 'get',
    }
  });
});
