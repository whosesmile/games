// 全部游戏
(function () {
  if (location.pathname !== '/games') {
    return false;
  }

  loadMoreFactory({
    url: '/games/ajax/list',
    panel: '#games',
    template: 'home/games.html'
  });

})();

// 分类游戏
(function () {
  if (location.pathname.indexOf('/games/') !== 0) {
    return false;
  }

  loadMoreFactory({
    url: '/games/ajax/list?type=' + location.pathname.split('/')[2],
    panel: '#games',
    template: 'home/games.html'
  });

})();

// 游戏详情
(function () {
  if (location.pathname.indexOf('/game/') !== 0) {
    return false;
  }

  // 展开|关闭详情
  $(document).on('click', '#introduce .action', function () {
    $('#introduce .summary, #introduce .content').toggle();
    $('#introduce .action').html($('#introduce .summary').is(':visible') ? '查看全文' : '收起全文');
  });
})();
