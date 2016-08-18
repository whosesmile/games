/* 左侧菜单 */
app.directive('whatAreYouLookingFor', function ($state) {
  return {
    restrict: 'E',
    scope: {
      name: '@',
    },
    templateUrl: 'partial/boot.html',
  };
});

/* 左侧菜单 */
app.directive('menubar', function ($state) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partial/menubar.html',
    link: function (scope, element, attrs) {
      // 激活菜单组
      $(element).on('click', '.menu', function () {
        $(element).find('.menu').not(this).each(function () {
          $(this).parent().removeClass('active');
        });
        $(this).parent().toggleClass('active');
      });

      // 激活菜单项
      $(element).on('click', 'ul ul li', function () {
        $(element).find('ul ul li').removeClass('active');
        $(this).toggleClass('active');
      });
    }
  };
});

/* 上传组件 */
app.directive('upload', function ($state) {
  return {
    restrict: 'E',
    scope: {
      name: '=',
      width: '@',
      height: '@',
      scale: '@',
    },
    templateUrl: 'partial/upload.html',
    link: function (scope, element, attrs) {
      $(element).on('change', 'input', function () {
        var input = $(this)[0];
        if (input.files.length === 0) {
          return false;
        }
        var data = new FormData();
        for (var i = 0; i < input.files.length; i++) {
          data.append('file', input.files[i])
        }

        $.ajax({
          url: '/upload',
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function (res) {
            if (res.code !== 200) {
              return console.error('服务器异常，请联系前端开发人员');
            }
            scope.name = res.data.list[0];
            scope.$apply();
          }
        });
      });
    }
  };
});

/* 上传组件 */
app.directive('picture', function ($state) {
  return {
    restrict: 'E',
    scope: {
      list: '='
    },
    templateUrl: 'partial/picture.html',
    link: function (scope, element, attrs) {
      $(element).on('change', 'input', function () {
        var input = $(this)[0];
        if (input.files.length === 0) {
          return false;
        }
        var data = new FormData();
        for (var i = 0; i < input.files.length; i++) {
          data.append('file', input.files[i])
        }
        $.ajax({
          url: '/upload',
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function (res) {
            if (res.code !== 200) {
              return console.error('服务器异常，请联系前端开发人员');
            }
            scope.list = (scope.list || []).concat(res.data.list);
            scope.$apply();
          }
        });
      });

      scope.delete = function (item) {
        var index = scope.list.indexOf(item);
        scope.list.splice(index, 1);
      };
    }
  };
});
