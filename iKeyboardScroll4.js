/**
 * 检测键盘状态
 * @author: zawaliang
 */

define(function(require, exports, module) {
    var _initWinWidth = $(window).width(),
        _initWinHeight = $(window).height(),
        _landscape = !!(window.orientation & 2), // http://www.codecouch.com/2011/11/detecting-orientation-changes-in-mobile-safari-on-ios-and-other-supported-browsers/
        _landscape2 = _landscape,
        _activeElement = null,
        _display = false,
        _ios7 = $.os.ios && parseFloat($.os.version) >= 7,
        _callback = [];


    function watch(selector) {
        $(selector).each(function(k, v) {
            if ($(v).attr('data-keyboard-init') != 1) {
                // iOS7下focus(或者click)可能存在聚焦失败的情况，这里统一使用tap
                $(v).on('tap', function(e) {
                    _activeElement = this;

                    // iOS7不触发focus,这里手动触发; 这里的focus不可去掉,否则fixIScroll4Onchange里的focus可能存在不生效的情况
                    _ios7 && this.focus();
                }).on('blur', function(e) {
                    _activeElement = null;
                }).attr('data-keyboard-init', 1);
            }
        });
    }

    function pushCallback(callback) {
        if ($.type(callback) == 'function') {
            _callback.push(callback);
        }
    }


    // 获取聚焦元素, 事件代理的方式可能被阻止冒泡,这里使用直接绑定
    watch('input,textarea');


    $(window).on('orientationchange', function(e) {
        _landscape2 = !!(window.orientation & 2);
    }).on('resize', function(e) {
        // 不确定orientationchange与onresize哪个先触发,这里稍微延时
        setTimeout(function() {
            // Android下orientationchange之后获取window值会延时
            if (_landscape != _landscape2) {
                // 屏幕翻转且翻转前键盘处于显示状态时,交换宽高
                if (_display) {
                    var tmpWidth = _initWinWidth;
                    _initWinWidth = _initWinHeight;
                    _initWinHeight = tmpWidth;
                } else {
                    _initWinWidth = $(window).width();
                    _initWinHeight = $(window).height();
                }
            }

            var h = $(window).height();
            _display = _activeElement !== null && _initWinHeight > h;

            $.each(_callback, function(k, v) {
                v.apply(null, [_display, _activeElement]);
            });
            _landscape = _landscape2;
        }, 200);
    });
    

    return {
        /**
         * 为元素添加监控，适用于新增的元素
         * @param {String|Object} selector
         */
        watch: watch,
        /**
         * 绑定键盘显隐回调, 会在窗口尺寸变化时触发
         * @param {Function} callback(display, focusElement) display为true时表单键盘显示; focusElement聚焦元素
         */
        onchange: pushCallback,

        /**
         * 键盘变化时同步刷新iScroll4,并且定位到聚焦元素处
         * @param {Object} iScrollInstance iScroll实例
         * @param {Int} [offset :5px] 聚焦元素偏移值
         */
        fixIScroll4Onchange: function(iScrollInstance, offset) {
            pushCallback(function(display, focusElement) {
                // 当iScroll使用resize时,键盘出现会自动刷新高度,这里只对使用onorientationchange的情况做处理
                if ('onorientationchange' in window) {
                    iScrollInstance.refresh();
                }

                // 聚焦且键盘显示时,修正输入框位置
                // iOS6会自动定位到输入框,但还是需要refresh位置
                // iOS7不会自动定位到输入框,表现跟Android类似
                if ((!$.os.ios || _ios7) 
                    && display && focusElement) {
                    offset = $.type(offset) == 'number' ? offset : 5;

                    var el = $(focusElement),
                        winHeight = $(window).height(),
                        top = el.height() + el.offset().top + offset;

                    // iScrollInstance.y为负值
                    if (top - iScrollInstance.y > winHeight) {
                        iScrollInstance.scrollTo(0, winHeight - top + iScrollInstance.y, 0);
                    }

                    // iOS7下聚焦键盘出现后,输入框没聚焦,这里设置下
                    _ios7 && focusElement.focus();
                }
            });
        }
    };
});
