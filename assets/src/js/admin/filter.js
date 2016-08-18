// 上线状态
app.filter('status', function () {
  return function (status, reverse) {
    if (reverse) {
      status = !status;
    }
    return status ? '上线' : '下线';
  };
});
