// 上线状态
app.filter('status', function () {
  return function (status, reverse) {
    if (reverse) {
      status = !status;
    }
    return status ? '上架' : '下架';
  };
});
