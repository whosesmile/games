/*!
 * 滑动焦点图
 */
(function (global) {

  global.swipe = function (selector) {
    var index = 0;
    var pages = null;
    var items = $(selector).find('.wrap > .item');
    var basis = $(selector).prop('offsetWidth');

    // 添加分页
    if (items.length > 1) {
      var frag = '';
      for (var i = 0; i < items.length; i++) {
        frag += '<a class=""></a>';
      }
      var foot = $('<div class="pages" />').html(frag);
      pages = foot.children();
      pages.eq(index).addClass('active');
      $(selector).append(foot);
    }

    // 设置容器宽度
    $(selector).find('.wrap').css('width', basis * items.length);

    // 设置元素宽度
    items.forEach(function (item) {
      $(item).css('width', basis);
    });

    // 自动播放
    var timer = null;

    // 移动效果
    var running = false;

    function move(index) {
      running = true;
      clearInterval(timer);
      $('.swipe > .wrap').animate({
        left: -index * basis
      }, 400, 'ease-in-out', function () {
        running = false;
        pages.removeClass('active').eq(index).addClass('active');
        autoplay();
      });
    }

    // 左移
    function move2left() {
      if (!running) {
        index = index + 1;
        if (index >= items.length) {
          index = 0;
        }
        move(index);
      }
    }

    // 右移
    function move2right() {
      if (!running) {
        index = index - 1;
        if (index < 0) {
          index = items.length - 1;
        }
        move(index);
      }
    }

    // 记录起始点
    var xDown = null;
    var yDown = null;

    // 移动判断
    function handleMove(evt) {
      evt.preventDefault();
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      // 水平移动
      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 80) {
        if (xDiff > 0) {
          /* left swipe */
          move2left();
        }
        else {
          /* right swipe */
          move2right();
        }
      }
    }

    // 开始
    $(selector).on('touchstart', function (evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
      $(document).on('touchmove', handleMove);
    });

    // 结束
    $(document).on('touchend', function (evt) {
      $(document).off('touchmove', handleMove);
    });

    // 分页
    $(this).on('click', '.pages a', function () {
      index = $(this).index();
      move(index);
    });

    // 自动开始
    function autoplay() {
      clearInterval(timer);
      timer = setInterval(move2left, 5000);
    }

    autoplay();
  };

  // 默认滚动
  $('[data-swipe="true"]').each(function () {
    swipe(this);
  });

})(window);

/**
 * 延迟加载图片 https://github.com/luis-almeida
 */
(function ($) {
  $.fn.unveil = function (threshold, callback) {
    var $w = $(window),
      th = threshold || 0,
      retina = window.devicePixelRatio > 1,
      attrib = retina ? "data-src-retina" : "data-src",
      images = this,
      loaded;

    this.one("unveil", function () {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function () {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
          wb = wt + $w.height(),
          et = $e.offset().top,
          eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);
    unveil();
    return this;
  };
  // 默认开启延迟加载
  $('img[data-src]').unveil(300);
})(window.jQuery || window.Zepto);

/**
 * 监听滚动回调 通常用于翻页
 */
(function (global) {

  var fns = [];

  // 给文档绑定滚动事件
  var addLisener = function () {
    // 滚动临界点
    var threshold = 300;
    // 防止重复请求
    var loading = false;
    var $window = $(window);
    $(window).on('scroll.more resize.more lookup.more', function (e) {
      if (!loading) {
        // 整个高度 - 滚动条位置 < threshold
        if (document.body.scrollHeight - document.body.scrollTop - document.documentElement.clientHeight < threshold) {
          loading = true;
          fireCallback().then(function (data) {
            loading = false;
            return data;
          });
        }
      }
    });

    addLisener = $.noop;
  };

  // 调用注册回调
  var fireCallback = function () {
    return new Promise(function (resolve, reject) {
      var num = fns.length;
      var list = [];
      fns.forEach(function (fn) {
        fn().then(function (res) {
          list.push(res);
          --num;
          if (num === 0) {
            resolve(list);
          }
        });
      });
    });

  };

  // 添加滚动事件
  global.listenScroll = function (fn) {
    if (typeof fn === 'function' && fns.indexOf(fn) === -1) {
      fns.push(fn);
      addLisener();
    }
  };

  // 添加一个翻页模板函数
  global.loadMoreFactory = function (options) {
    // 加载更多分页
    var page = options.page || 1;
    var size = options.size || 20;
    // 是否执行
    var before = options.before || function () {
      return true;
    };
    // 事后回调
    var after = options.after || $.noop;

    var more = true; // 是否有更多数据

    // 第一个回调
    return listenScroll(function () {
      return new Promise(function (resolve, reject) {
        if (more === false || !before()) {
          return resolve(null);
        }
        // 添加loading文案
        if ($('section p.loadmore').length === 0) {
          $('section').append('<p class="loadmore">正在加载...</p>');
        }
        $.get(options.url, {
          page: ++page,
          size: size,
        }).then(function (res) {
          if (res.code === 200) {
            var pieces = $(Template.compile(options.template, res.data)).appendTo(options.panel);
            // 添加延迟加载图片功能
            pieces.find('img[data-src]').unveil(300);
            more = res.data.list.length >= size;
            after(res.data);

            if (!more) {
              $('section p.loadmore').remove();
            }
          }
          resolve(res);
        });
      });
    });
  };

})(window);
