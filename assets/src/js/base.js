/*!
 * 滚动方法
 */
(function ($) {
  // 绝对值
  $.scrollTo = function (endY, duration) {
    endY = endY || ($.os.android ? 1 : 0);
    duration = duration || 350;
    var startT = Date.now();
    var startY = document.body.scrollTop;
    var finishT = startT + duration;

    var interpolate = function (source, target, shift) {
      return (source + (target - source) * shift);
    };

    var easing = function (pos) {
      return (-Math.cos(pos * Math.PI) / 2) + .5;
    };

    var animate = function () {
      var now = Date.now();
      var shift = (now > finishT) ? 1 : (now - startT) / duration;
      window.scrollTo(0, interpolate(startY, endY, easing(shift)));
      if (now < finishT) {
        setTimeout(animate, 15);
      }
    };

    animate();
  };

  // 差值
  $.scrollBy = function (incre, duration) {
    return $.scrollTo(document.body.scrollTop + incre, duration)
  };
})(window.jQuery || window.Zepto);

/*!
 * 配置模板
 */
(function (global) {
  var env = nunjucks.configure();

  // 增加全局过滤器
  env.addFilter('example', function (input) {
    return input;
  });

  // 对外提供句柄
  global.template = env;

})(window);

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

/*!
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

/*!
 * 弹窗控件
 */
(function (global) {

  var widget = null;

  // 默认文案
  var options = {
    title: '温馨提示',
    message: '天啦噜，这都被你发现啦！',
    cancelText: '取消',
    confirmText: '确定',
    type: 'default',
    reject: $.noop,
    callback: $.noop,
  };

  // 兼容各种参数类型
  function compatible(context, callback) {
    if (widget !== null) {
      widget.remove();
    }
    if (typeof context !== 'object') {
      context = {
        message: context
      };
    }
    if (typeof callback === 'function') {
      context.callback = callback;
    }

    return $.extend({}, options, context);
  }

  global.Modal = {

    alert: function (context, callback) {
      context = compatible(context, callback);
      widget = $(template.render('alert.html', context)).appendTo('body');
      widget.on('click', '.footer .confirm', function () {
        if (context.callback() !== false) {
          widget.hide();
        }
      });

      return widget;
    },

    confirm: function (context, callback) {
      context = compatible(context, callback);
      widget = $(template.render('confirm.html', context)).appendTo('body');
      widget.on('click', '.footer .cancel', function () {
        if (context.reject() !== false) {
          widget.hide();
        }
      });
      widget.on('click', '.footer .confirm', function () {
        if (context.callback() !== false) {
          widget.hide();
        }
      });

      return widget;
    }
  };
})(window);

/*!
 * 吐司控件
 */
(function (global) {

  var widget = null;

  // 预配置
  var preconfig = {
    loading: {
      icon: '&#xe60d;',
      message: '载入中',
      extra: 'wait'
    },
    failure: {
      icon: '&#xe613;',
      message: '操作失败',
    },
    success: {
      icon: '&#xe611;',
      message: '操作成功',
    },
    network: {
      icon: '&#xe610;',
      message: '网络异常',
    },
  };

  global.Toast = {

    show: function (options) {
      if (widget !== null) {
        widget.remove();
      }
      var context = $.extend({
        icon: '&#xe60e;',
        message: '天啦噜',
        holding: 4000
      }, options);

      widget = $(template.render('toast.html', context)).appendTo('body');

      if (typeof context.holding === 'number') {
        setTimeout(Toast.hide.bind(Toast), context.holding);
      }

      return widget;
    },

    hide: function () {
      if (widget !== null) {
        widget.hide();
      }
      return widget;
    },
  };

  // 添加快捷方式
  Object.keys(preconfig).forEach(function (type) {
    Toast[type] = function () {
      return this.show(preconfig[type]);
    };
  });
})(window);

/*!
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
          callbacks().then(function (data) {
            loading = false;
            return data;
          });
        }
      }
    });

    addLisener = $.noop;
  };

  // 调用注册回调
  var callbacks = function () {
    return new Promise(function (resolve, reject) {
      var list = [];
      var num = fns.length;
      fns.forEach(function (fn) {
        fn().then(function (res) {
          list.push(res);
          if (--num === 0) {
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

  // loading tips
  var loadmore = $('<div class="loadmore"><i class="icon">&#xe60d;</i> 加载中...</div>');

  // 添加一个翻页模板函数
  global.loadMoreFactory = function (options) {
    // 是否有更多数据
    var more = true;
    var page = options.page || 1;
    var size = options.size || 20;
    // 是否执行
    var before = options.before || $.noop;
    // 事后回调
    var after = options.after || $.noop;

    // 预先执行
    loadmore.appendTo('body');

    // 第一个回调
    return listenScroll(function () {
      return new Promise(function (resolve, reject) {
        if (more === false || before() === false) {
          return resolve(null);
        }
        $.get(options.url, {
          page: ++page,
          size: size,
        }).then(function (res) {
          if (res.code === 200) {
            var pieces = $(template.render(options.template, res.data)).appendTo(options.panel);
            // 添加延迟加载图片功能
            pieces.find('img[data-src]').unveil(300);
            more = res.data.list.length >= size;
            after(res.data);
            if (!more) {
              loadmore.remove();
            }
          }
          resolve(res);
        });
      });
    });
  };

})(window);
