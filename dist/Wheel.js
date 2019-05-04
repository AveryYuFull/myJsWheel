/*!
 * my-js-wheel v1.0.10
 * (c) 2017-2019 penyuying
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Wheel = {})));
}(this, (function (exports) { 'use strict';

/**
 * 获取当前时间
 *
 * @export
 * @returns {Number} 时间戳
 */


/**
 * 拷贝对象
 *
 * @export
 * @param {Object} target 默认对象
 * @param {Object} rest 被拷贝的对象
 * @returns {Object} target
 */
function extend(target) {
    var isDeep = true;
    var n = 0;

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
    }

    if (rest && rest.length < 1) {
        return typeof target === 'boolean' ? {} : target;
    }
    if (typeof target === 'boolean') {
        isDeep = target;
        target = rest[0];
        n = 1;
    }
    for (var i = 0 + n; i < rest.length; i++) {
        var source = rest[i];
        if (source instanceof Object) {
            for (var key in source) {
                if (isDeep && source[key] instanceof Object) {
                    target[key] = extend(source[key] instanceof Array ? [] : {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}

/**
 * 判断是否是浏览器环境
 * @returns {Boolean} 返回环境是否是浏览器
 */
function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * 判断是否是微信开发者工具
 * @returns {Boolean} 返回是否是微信开发者工具
 */
function isWeChatDevTools() {
    if (!isBrowser()) {
        return false;
    }
    var _ua = navigator.userAgent || '';
    _ua = _ua.toLowerCase();
    return (/wechatdevtools/.test(_ua)
    );
}

/**
 * 判断是否有touch事件
 * @returns {Boolean} 判读结果
 */
function isTouch() {
  return isBrowser() && ('ontouchstart' in window || isWeChatDevTools());
}

var _vendor = function () {
    var _dom = document.createElement('div').style;
    var _transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    };
    for (var key in _transformNames) {
        if (typeof _dom[_transformNames[key]] !== 'undefined') {
            return key;
        }
    }
    return false;
}();

/**
 * 过滤样式的key
 * @param {String} style 样式
 * @returns {String} 返回样式
 */
function prefixStyle(style) {
    if (_vendor) {
        if (_vendor === 'standard') {
            if (style === 'transitionEnd') {
                style = 'transitionend';
            }
        } else {
            style = _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }
    }
    return style;
}

/**
 * 默认配置信息
 */
var DEFAULT_CONFIG = {
  wheelEl: '', // 滚轮列表: 元素列表，元素的选择符（如果为空，则选择el的第一个子元素）
  wheelItemEl: '', // 滚轮列表项元素：元素列表，元素的选择符（如果为空，则取wheelEl的子元素列表）
  direction: 'vertical', // 滚轮方向
  blurWidth: 20, // 留边距离
  itemWidth: 0, // 列表项宽度
  itemHeight: 0, // 列表项的高度
  activeCls: 'active', // 活动class
  visibleCls: 'visible', // 可视的class
  selectedIndex: 0, // 默认选中项
  bindToWrapper: false, // 是否将事件绑定在滚轮包裹元素上
  disableMouse: isTouch(), // 是否隐藏mouse事件
  disableTouch: !isTouch(), // 是否隐藏touch事件
  preventDefaultException: {
    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
  },
  preventDefault: true, // 是否允许阻止事件的默认行为
  stopPropagation: true, // 是否允许阻止事件冒泡
  momentum: true, // 是否开启momentum动画
  momentumLimitTime: 300, // 只有在屏幕快速滑动的时间小于momentumLimitTime才开启momentum动画
  momentumLimitDistance: 15, // 只有在屏幕快速滑动的距离大于momentumLimitDistance才开启momentum动画
  useTransition: true, // 是否使用transition
  bounceTime: 70, // 回弹动画时长
  deceleration: 0.001, // 减速度
  swipeTime: 250, // momentum动画时长
  swipeBounceTime: 50 // momentum动画回弹时长


  /**
   * 列表项默认宽度
   */
};var DEFAULT_ITEM_WIDTH = 100;

/**
 * 列表项默认高度
 */
var DEFAULT_ITEM_HEIGHT = 40;

/**
 * 最大可以超过的角度
 */
var DEFAULT_MAX_EXCEED = 30;

/**
 * 可视范围
 */
var VISIBLE_RANGE = 90;

/**
 * css3动画样式
 */
var styleName = {
  transform: prefixStyle('transform'),
  transformOrigin: prefixStyle('transformOrigin'),
  transition: prefixStyle('transition'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionEnd: prefixStyle('transitionEnd')

  /**
   * touch事件
   */
};var TOUCH_EVENT = 0;

/**
 * mouse事件
 */
var MOUSE_EVENT = 1;

/**
 * 事件类型
 */
var evtType = {
  touchstart: TOUCH_EVENT,
  touchmove: TOUCH_EVENT,
  touchcancel: TOUCH_EVENT,
  touchend: TOUCH_EVENT,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mousecancel: MOUSE_EVENT,
  mouseup: MOUSE_EVENT
};

/**
 * 移动方向
 */
var MOVING_DIRECTION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};

/**
 * 事件类型
 */
var EVENT_TYPE = {
  BEFORE_SCROLL_START: 'beforeScrollStart',
  SCROLL_START: 'scrollStart',
  SCROLL: 'scroll',
  TOUCH_END: 'touchEnd',
  SCROLL_END: 'scrollEnd'
};

/**
 * 弧度转换成角度
 * @param {Number} rad 弧度
 * @returns {Number} 角度
 */
function rad2deg(rad) {
  return rad * 180 / Math.PI;
}

/**
 * 计算夹角
 * @param {Number} r 半径
 * @param {Number} c 第三条边的长度
 * @returns {Number} 返回半径和c这条边的夹角
 */
function calcAngle(r, c) {
    var _a = parseFloat(r);
    var _b = _a;
    c = Math.abs(c);
    var _d = r * 2;
    var _intDeg = parseInt(c / _d) * 180;
    c = c % _d;
    var _cosX = (_a * _a + _b * _b - c * c) / (2 * _a * _b);
    var _aCosX = Math.acos(_cosX);
    var _deg = rad2deg(_aCosX);
    return _intDeg + _deg;
}

/**
 * 初始化模块
 * @param {Wheel} Wheel Wheel构造方法
 */
function initModule(Wheel) {
    /**
     * 刷新
     */
    Wheel.prototype.refresh = function () {
        var _that = this;
        var _el = _that._el;
        var _options = _that._options;

        _that._resetItems();

        var _width = _el && _el.offsetWidth || 0;
        var _height = _el && _el.offsetHeight || 0;
        var _direction = _options.direction || 'vertical';

        var _sizeParams = void 0;
        var _defaultSize = void 0;
        if (_direction === 'horizontal') {
            _that._r = _width / 2 - _options.blurWidth;
            _defaultSize = DEFAULT_ITEM_WIDTH;
            _sizeParams = 'Width';
        } else if (_direction === 'vertical') {
            _that._r = _height / 2 - _options.blurWidth;
            _defaultSize = DEFAULT_ITEM_HEIGHT;
            _sizeParams = 'Height';
        }
        var _wheelItems = _that._wheelItemsEl;
        var _wheelItem = _wheelItems && _wheelItems[0];
        _that._itemSize = _options['item' + _sizeParams] || _wheelItem && _wheelItem['offset' + _sizeParams] || _defaultSize;
        _that._d = _that._r * 2;
        _that._itemAngle = parseInt(calcAngle(_that._r, _that._itemSize * 0.8));

        _that._beginAngle = 0;
        _that._angle = _that._beginAngle;
        _that._beginExceed = _that._beginAngle - DEFAULT_MAX_EXCEED;
        _that._visibleRange = VISIBLE_RANGE;
        _that._highlightRange = _that._itemAngle / 2;
        _that._calcItemPosition();
        _that._initItemVisibility(_that._angle);
        _that.index > 0 && _that.wheelTo(_that.index);
    };

    /**
     * 初始化方法
     * @param {HTMLElement} el 元素节点
     * @param {Object} options 可选参数
     */
    Wheel.prototype._init = function (el, options) {
        var _that = this;
        _that._el = el;
        _that._initOptions(options);
        _that._initEl(el);
        _that.refresh();
        _that._watchTransition();
        _that.index = _that._options.selectedIndex;
        _that.index > 0 && _that.wheelTo(_that.index);
    };

    /**
     * 初始化options参数
     * @param {Object} options 可选参数
     */
    Wheel.prototype._initOptions = function (options) {
        var _that = this;
        _that._options = extend({}, DEFAULT_CONFIG, options);
    };
}

/**
 * 添加事件处理程序
 * @param {HTMLElement} el 事件对象
 * @param {String} type 事件类型
 * @param {Function} fn 事件处理程序
 * @param {Boolean} capture 处理事件的时机（捕获/冒泡）
 */
function _addHandler(el, type, fn, capture) {
    if (!el || !type || !fn) {
        return;
    }
    capture = capture || false;
    if (el.addEventListener instanceof Function) {
        el.addEventListener(type, fn, capture);
    } else if (el.attachEvent instanceof Function) {
        el.attachEvent('on' + type, fn);
    } else {
        el['on' + type] = fn;
    }
}

/**
 * 移除事件处理程序
 * @param {HTMLElement} el 事件对象
 * @param {String} type 事件类型
 * @param {Function} fn 事件处理方法
 * @param {Boolean} capture 处理事件的时机（捕获/冒泡）
 */
function _removeHandler(el, type, fn, capture) {
    if (!el || !type || !fn) {
        return;
    }

    capture = capture || false;
    if (el.removeEventListener instanceof Function) {
        el.removeEventListener(type, fn, capture);
    } else if (el.detachEvent instanceof Function) {
        el.detachEvent('on' + type, fn);
    } else {
        el['on' + type] = null;
    }
}

/**
 * 获取event对象
 * @param {Event} evt 事件对象
 * @returns {Event} 返回事件对象
 */
function _getEvent(evt) {
    return evt || window.event;
}

/**
 * 阻止事件默认行为
 * @param {Event} evt 事件对象
 */
function _preventDefault(evt) {
    evt = _getEvent(evt);
    if (!evt) {
        return;
    }
    if (evt.preventDefault instanceof Function) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
}

/**
 * 获取事件的target对象
 * @param {Event} evt 事件对象
 * @returns {Event} 返回target对象
 */
function _getTarget(evt) {
    var res = null;
    evt = _getEvent(evt);
    if (evt) {
        res = evt.target || evt.srcElement;
    }
    return res;
}

/**
 * 阻止事件冒泡
 * @param {Event} evt 事件对象
 */
function _stopPropagation(evt) {
    evt = _getEvent(evt);
    if (!evt) {
        return;
    }

    if (evt.stopPropagation instanceof Function) {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }
}

/**
 * 获取button属性
 * @param {Event} evt 事件对象
 * @returns {String} 事件button属性
 */
function _getButton(evt) {
    var res = void 0;
    if (evt) {
        var _button = evt.button + '';
        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
            res = _button;
        } else {
            switch (_button) {
                case '0':
                case '1':
                case '3':
                case '5':
                case '7':
                    res = '0';
                    break;
                case '2':
                case '6':
                    res = '2';
                    break;
                case '4':
                    res = '1';
                    break;
            }
        }
    }
    return res;
}

/**
 * 添加／解除事件监听器
 * @param {HTMLElement} el 事件监听元素
 * @param {String|Array} types 事件类型
 * @param {Function} fn 事件处理程序
 * @param {Boolean} flag 添加／解除事件监听
 * @param {Boolean|Object} capture 在捕获／冒泡阶段处理事件
 * @returns {Boolean} 是否成功
 */
function _initEventListener(el, types, fn, flag) {
    var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (!el || !types || !fn) {
        return false;
    }

    capture = capture || false;
    flag = !flag ? 'remove' : 'add';

    if (!(types instanceof Array)) {
        types = [types];
    }
    types.forEach(function (type) {
        _initEvent(type);
    });

    return true;

    /**
     * 添加／解除事件监听器
     * @param {String} type 事件类型
     */
    function _initEvent(type) {
        var _fn = null;
        switch ((flag || '') + '') {
            case 'add':
                _fn = _addHandler;
                break;
            case 'remove':
                _fn = _removeHandler;
                break;
        }
        if (_fn instanceof Function) {
            _fn(el, type, fn, capture);
        }
    }
}

var eventUtil = {
    initEventListener: _initEventListener,
    addHandler: _addHandler,
    removeHandler: _removeHandler,
    getEvent: _getEvent,
    getTarget: _getTarget,
    getButton: _getButton,
    preventDefault: _preventDefault,
    stopPropagation: _stopPropagation
};

/**
 * 判断是否允许阻止事件的默认行为
 * @param {HTMLElement} target 事件对象
 * @param {Object} options 可选参数
 */
function preventDefaultException(target, options) {
    if (!target) {
        return true;
    }
    options = options || {};
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            var _item = options[key];
            if (_item && _item.test instanceof Function && _item.test(target[key])) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 获取当前时间戳
 * @returns {Number} 返回当前的时间戳
 */
function getNow$1() {
    var _res = void 0;
    if (window && window.performance && window.performance.now) {
        _res = window.performance.now() + window.performance.timing.navigationStart;
    } else {
        _res = Date.now();
    }
    return _res;
}

var ease = {
  // easeOutQuint
  swipe: {
    style: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fn: function fn(t) {
      return 1 + --t * t * t * t * t;
    }
  },
  // easeOutQuard
  swipeBounce: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function fn(t) {
      return t * (2 - t);
    }
  },
  // easeOutQuart
  bounce: {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function fn(t) {
      return 1 - --t * t * t * t;
    }
  }
};

(function () {
    var _vendors = ['webkit', 'moz', 'o', 'ms'];
    var _lastTime = 0;
    for (var i = 0; i < _vendors.length && !window.requestAnimationFrame; i++) {
        var _prefix = _vendors[i];
        window.requestAnimationFrame = window[_prefix + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[_prefix + 'CancelAnimationFrame'] || window[_prefix + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (cb) {
            var _nowTime = getNow$1();
            var _timeToCall = Math.max(0, 17 - (_nowTime - _lastTime));
            var _timeId = setTimeout(function () {
                if (cb instanceof Function) {
                    cb();
                }
            }, _timeToCall);
            _lastTime = _nowTime + _timeToCall;
            return _timeId;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
})();

var raf = {
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame
};

/**
 * 将滑动距离转换为角度
 * @param {Number} r 半径
 * @param {Number} delta 距离
 * @param {Number} angle 当前的角度
 * @param {Number} lowMargin 最小范围
 * @param {Number} upMargin 最大边界
 * @returns {Number} 返回角度
 */
function delta2deg(r, delta, angle, lowMargin, upMargin) {
    var _deltaRange = calcAngle(r, delta);
    var _newAngle = delta > 0 ? angle - _deltaRange : angle + _deltaRange;
    if (_newAngle < lowMargin) {
        _newAngle = lowMargin;
    } else if (_newAngle > upMargin) {
        _newAngle = upMargin;
    }
    return _newAngle;
}

/**
 * 开启动量计算
 * @param {Number} startPos 开始位置
 * @param {Number} curPos 当前位置
 * @param {Number} time 时间间隔
 * @param {Number} r 半径
 * @param {Number} angle 当前角度
 * @param {Number} lowMargin 最小距离
 * @param {Number} upMargin  最大距离
 * @param {Object} options 可选参数
 * @returns {Object} 返回距离
 */
function momentum(startPos, curPos, time, r, angle, lowMargin, upMargin, options) {
    var _speed = (curPos - startPos) / time;
    var swipeTime = options.swipeTime,
        swipeBounceTime = options.swipeBounceTime,
        deceleration = options.deceleration;

    var _delta = _speed / deceleration;
    var _duration = swipeTime;
    var _newAngle = delta2deg(r, _delta, angle, lowMargin, upMargin);
    return {
        angle: _newAngle,
        duration: _duration
    };
}

// import getStyle from '../utils/getStyle';
/**
 * 核心模块
 * @param {Wheel} Wheel Wheel构造方法
 */
function coreModule(Wheel) {
    /**
     * 初始化事件
     */
    Wheel.prototype._bindEvent = function (flag) {
        var _that = this;
        var _options = _that._options;
        var _target = _options.bindToWrapper ? _that._el : window;
        if (isTouch() && !_options.disableTouch) {
            eventUtil.initEventListener(_that._el, 'touchstart', _that, flag);
            eventUtil.initEventListener(_target, 'touchmove', _that, flag);
            eventUtil.initEventListener(_target, ['touchcancel', 'touchend'], _that, flag);
        }
        if (!_options.disableMouse) {
            eventUtil.initEventListener(_that._el, 'mousedown', _that, flag);
            eventUtil.initEventListener(_target, 'mousemove', _that, flag);
            eventUtil.initEventListener(_target, ['mousecancel', 'mouseup'], _that, flag);
        }
        eventUtil.initEventListener(_that._wheelEl, styleName.transitionEnd, _that, flag);
    };

    /**
     * 事件处理方法
     * @param {Event} evt 事件对象
     */
    Wheel.prototype.handleEvent = function (evt) {
        var _that = this;
        evt = eventUtil.getEvent(evt);
        var _type = evt && evt.type || '';
        switch (_type) {
            case 'touchstart':
            case 'mousedown':
                _that._start(evt);
                break;
            case 'touchmove':
            case 'mousemove':
                _that._move(evt);
                break;
            case 'touchend':
            case 'touchcancel':
            case 'mouseup':
            case 'mousecancel':
                _that._end(evt);
                break;
            case styleName.transitionEnd:
                _that._transitionEnd(evt);
                break;
        }
    };

    /**
     * 开始
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._start = function (evt) {
        var _that = this;
        evt = eventUtil.getEvent(evt);
        var _type = evt && evt.type || '';
        var _evtType = evtType[_type];
        if (_evtType !== TOUCH_EVENT) {
            var _button = eventUtil.getButton(evt);
            if (_button !== '0') {
                return;
            }
        }

        if (_that.initiated && _that.initiated !== _evtType) {
            return;
        }

        _that.initiated = _evtType;
        _that._preventEvent(evt);

        _that.pointPos = _that._getPos(evt);
        _that.absStartPos = _that.pointPos;
        _that.startPos = _that.pointPos;
        _that.movingDirection = 0;
        _that.startTime = getNow$1();
        _that.moved = false;

        _that.trigger(EVENT_TYPE.BEFORE_SCROLL_START, {
            index: _that._getSelectedIndex()
        });
    };

    /**
     * 移动
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._move = function (evt) {
        var _that = this;
        evt = eventUtil.getEvent(evt);
        var _type = evt && evt.type || '';
        var _evtType = evtType[_type];
        var _options = _that._options;
        if (_that.initiated !== _evtType) {
            return;
        }

        _that._preventEvent(evt);

        var _curPos = _that._getPos(evt);
        var _delta = _curPos - _that.pointPos;
        _that.pointPos = _curPos;

        if (!_that.moved) {
            _that.trigger(EVENT_TYPE.SCROLL_START, {
                index: _that._getSelectedIndex()
            });
            _that.moved = true;
        }
        _that._scrollTo(delta2deg(_that._r, _delta, _that._angle, _that._beginExceed, _that._endExceed));
        var _timestamp = getNow$1();
        if (_timestamp - _that.startTime > _options.momentumLimitTime) {
            _that.momentumLimitTime = _timestamp;
            _that.startPos = _curPos;
        }
    };

    /**
     * 结束
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._end = function (evt) {
        var _that = this;
        evt = eventUtil.getEvent(evt);
        var _options = _that._options;
        var _type = evt && evt.type || '';
        var _evtType = evtType[_type];
        if (_that.initiated !== _evtType) {
            return;
        }
        _that.initiated = false;
        _that._preventEvent(evt);

        _that.trigger(EVENT_TYPE.TOUCH_END, {
            index: _that._getSelectedIndex()
        });

        if (_that._resetPos(_options.bounceTime, ease.bounce)) {
            return;
        }

        var _endTime = getNow$1();
        var _curPos = _that._getPos(evt);
        var _delta = _curPos - _that.absStartPos;
        var _direction = _options.direction || 'vertical';
        if (_direction === 'horizontal') {
            _that.movingDirection = _delta > 0 ? MOVING_DIRECTION.RIGHT : _delta < 0 ? MOVING_DIRECTION.left : 0;
        } else {
            _that.movingDirection = _delta > 0 ? MOVING_DIRECTION.BOTTOM : _delta < 0 ? MOVING_DIRECTION.TOP : 0;
        }
        var _duration = _endTime - _that.startTime;
        var _absDist = Math.abs(_curPos - _that.startPos);
        var _newAngle = _that._angle;
        var _time = 0;
        if (_options.momentum && _duration < _options.momentumLimitTime && _absDist > _options.momentumLimitDistance) {
            var _momentum = momentum(_that.startPos, _curPos, _duration, _that._r, _that._angle, _that._beginExceed, _that._endExceed, _options);
            _newAngle = _momentum.angle;
            _time = _momentum.duration;
        }
        if (_newAngle !== _that._angle) {
            console.log('_newAngle--->', _newAngle);
            _that._scrollTo(_newAngle, _time, ease.swipe);
        }
    };

    /**
     * 动画结束
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._transitionEnd = function (evt) {
        var _that = this;
        var _options = _that._options;
        var _target = eventUtil.getTarget(evt);
        if (!_that.isInTransition && !_that.isAnimating || _target !== _that._wheelEl) {
            return;
        }

        var _cancelAnimationFrame = raf.cancelAnimationFrame;
        if (_options.useTransition) {
            _cancelAnimationFrame(_that.probeTimer);
            _that.isInTransition = false;
            _that._setTransition(0, null);
        } else {
            _that.isAnimating = false;
            _cancelAnimationFrame(_that.animateTimer);
        }
        if (!_that._resetPos(_options.bounceTime, ease.bounce)) {
            _that.trigger(EVENT_TYPE.SCROLL_END, {
                index: _that._getSelectedIndex()
            });
        }
    };

    /**
     * reset位置
     * @param {Number} time 时长
     * @param {Object} easing 动画规则
     * @returns {Boolean} 是否重置成功
     */
    Wheel.prototype._resetPos = function (time, easing) {
        var _that = this;
        var _angle = _that._angle;
        var _res = false;
        if (_angle < _that._beginAngle) {
            _angle = _that._beginAngle;
            _res = true;
        } else if (_angle > _that._endAngle) {
            _angle = _that._endAngle;
            _res = true;
        } else {
            var index = parseInt(_angle / _that._itemAngle);
            _angle = index * _that._itemAngle;
        }

        if (_angle !== _that._angle) {
            _that._scrollTo(_angle, time, easing);
        }
        return _res;
    };

    /**
     * 滚动到指定的位置
     * @param {Number} angle 新的角度
     * @param {Number} time 动画时长
     * @param {Object} easing 动画规则
     */
    Wheel.prototype._scrollTo = function (angle, time, easing) {
        var _that = this;
        var _options = _that._options;
        if (!time) {
            _that._translateTo(angle);
        } else if (time && _options.useTransition) {
            _that.isInTransition = true;
            _that._setTransition(time, easing && easing.style);
            _that._translateTo(angle);
            // _that._startProbe();
        } else {
            _that.isAnimating = true;
            _that._animate(angle, time, easing && easing.fn);
        }
    };

    /**
     * 滚动到指定的位置
     * @param {Number} angle 新的角度
     * @param {Number} time 动画时长
     * @param {Object} easing 动画规则
     */
    Wheel.prototype._animate = function (angle, time, easing) {
        var _that = this;
        time = time || 0;
        var _startAngle = _that._angle;
        var _startTime = getNow$1();
        var _destTime = _startTime + time;
        var _caf = raf.cancelAnimationFrame;
        var _raf = raf.requestAnimationFrame;

        function _step() {
            var _nowTime = getNow$1();
            if (_nowTime >= _destTime) {
                _that._translateTo(angle);
                _that.dispatchEvent(_that._wheelEl, styleName.transitionEnd);
                return;
            }

            _nowTime = (_nowTime - _startTime) / time;
            var _newAngle = _startAngle + easing(_nowTime) * (angle - _startAngle);
            _that._translateTo(_newAngle);
            if (_that.isAnimating) {
                _that.animateTimer = _raf(_step);
            }
        }
        _caf(_that.animateTimer);
        _that.animateTimer = _raf(_step);
    };

    /**
     * 时时监听动画然后派发scroll事件
     */
    // Wheel.prototype._startProbe = function () {
    //     const _that = this;
    //     const _cancelAnimationFrame = raf.cancelAnimationFrame;
    //     const _requestAnimationFrame = raf.requestAnimationFrame;
    //     /**
    //      * 每一步调用的方法
    //      */
    //     function _step () {
    //         _that.trigger(EVENT_TYPE.SCROLL, {
    //             index: _that._getComputedPos()
    //         });
    //         if (!_that.isInTransition) {
    //             return;
    //         }
    //         _that.probeTimer = _requestAnimationFrame(_step)
    //     }
    //     _cancelAnimationFrame(_that.probeTimer);
    //     _that.probeTimer = _requestAnimationFrame(_step);
    // }

    /**
     * 获取位置信息
     * @returns {Number} 返回获取到的位置信息
     */
    // Wheel.prototype._getComputedPos = function () {
    //     const _that = this;
    //     const _options = _that._options;
    //     const _direction = _options.direction || 'vertical';
    //     let _matrix = getStyle(_that._wheelEl, styleName.transform) || '';
    //     _matrix = _matrix.split('matrix3d(');
    //     _matrix = (_matrix && _matrix[1]) || '';
    //     _matrix = _matrix.split(', ');
    //     let _index = -1;
    //     if (_matrix) {
    //         const _cosX = _direction === 'horizontal' ? _matrix[0] : _matrix[5];
    //         let angle = Math.atan(_matrix[6] / _cosX) / Math.PI * 180 + (_cosX < 0 ? 180 : 0);
    //         if (angle < 0) {
    //             angle += 360
    //         }
    //         if (_deg === 180) {
    //         }
    //         _index = _that._getSelectedIndex(rad2deg(Math.acos(_cosX)));
    //     }
    //     return _index;
    // }

    /**
     * 滑动到指定的位置
     * @param {Number} angle 新的角度
     */
    Wheel.prototype._translateTo = function (angle) {
        var _that = this;
        var _options = _that._options;
        var _wheelEl = _that._wheelEl;
        var _direction = _options.direction || 'vertical';
        if (_wheelEl) {
            var _style = '';
            if (_direction === 'horizontal') {
                _style = 'rotateY(-' + angle + 'deg)';
            } else {
                _style = 'rotateX(' + angle + 'deg)';
            }
            _wheelEl.style[styleName.transform] = _style;
            _that._angle = angle;
            _that._initItemVisibility(angle);
            _that.trigger(EVENT_TYPE.SCROLL, {
                index: _that._getSelectedIndex()
            });
        }
    };

    /**
     * 设置动画参数
     * @param {Number} time 动画时长
     * @param {String} easing 动画规则
     */
    Wheel.prototype._setTransition = function (time, easing) {
        var _that = this;
        time = time || 0;
        var _wheelEl = _that._wheelEl;
        if (_wheelEl) {
            _wheelEl.style[styleName.transitionDuration] = time + 'ms';
            _wheelEl.style[styleName.transitionTimingFunction] = easing;
        }
    };

    /**
     * 获取当前的索引
     * @param {Number} angle 当前角度
     * @returns {Number} 返回当前的索引
     */
    Wheel.prototype._getSelectedIndex = function (angle) {
        var _that = this;
        var _angle = angle || _that._angle;
        var _itemAngle = _that._itemAngle;
        var _index = 0;
        if (_itemAngle) {
            _index = parseInt(_angle / _itemAngle);
            _index = Math.abs(_index);
            if (_index < 0) {
                _index = 0;
            } else if (_index > _that._wheelItemsEl.length - 1) {
                _index = _that._wheelItemsEl.length - 1;
            }
        }
        return _index;
    };

    /**
     * 获取当前滚动的位置
     * @param {Event} evt 事件对象
     * @returns {Number} 返回位置
     */
    Wheel.prototype._getPos = function (evt) {
        var _that = this;
        var _options = _that._options;
        evt = eventUtil.getEvent(evt);
        var _point = evt.changedTouches ? evt.changedTouches[0] : evt;
        var _direction = _options.direction || 'vertical';
        var _pageAxes = _direction === 'horizontal' ? 'pageX' : 'pageY';
        return _point[_pageAxes];
    };

    /**
     * 阻止事件默认行为
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._preventEvent = function (evt) {
        var _that = this;
        var _options = _that._options;
        evt = eventUtil.getEvent(evt);
        if (_options.preventDefault && !preventDefaultException(eventUtil.getTarget(evt), _options.preventDefaultException)) {
            eventUtil.preventDefault(evt);
        }
        if (_options.stopPropagation) {
            eventUtil.stopPropagation(evt);
        }
    };

    /**
     * 滚动到指定的位置
     * @param {Number} index 索引
     */
    Wheel.prototype.wheelTo = function (index) {};

    /**
     * 监听是否在动画中
     */
    Wheel.prototype._watchTransition = function () {
        var _that = this;
        if (typeof Object.defineProperty === 'undefined') {
            return;
        }
        var _options = _that._options;
        var _isInTransition = false;
        var _key = _options.useTransition ? 'isInTransition' : 'isAnimating';
        Object.defineProperty(_that, _key, {
            get: function get() {
                return _isInTransition;
            },
            set: function set(nowVal) {
                _isInTransition = nowVal;
                var _elems = _that._wheelItemsEl ? _that._wheelItemsEl : [_that._wheelEl];
                var _pointerEvents = _isInTransition ? 'none' : 'auto';
                for (var i = 0; i < _elems.length; i++) {
                    var _el = _elems[i];
                    if (_el) {
                        _el.style.pointerEvents = _pointerEvents;
                    }
                }
            }
        });
    };
}

/**
 * 调试消息
 *
 * @export
 * @param {any} msg 消息内容
 */
function warn(msg) {
  console.error("[Wheel warn]: " + msg);
}

/**
 * dom操作模块
 * @param {Wheel} Wheel Wheel构造方法
 */
function domModule(Wheel) {
    /**
     * 初始化滚轮元素
     * @param {HTMLElement} el 滚轮元素的包裹元素节点
     */
    Wheel.prototype._initEl = function (el) {
        var _that = this;
        var _options = _that._options;
        var _wheelEl = _that._wheelEl = _that._getElements(_options.wheelEl, el)[0];
        if (_wheelEl) {
            _that._bindEvent(true);
        }
    };

    /**
     * 获取滚轮列表项集合
     */
    Wheel.prototype._resetItems = function () {
        var _that = this;
        var _wheelEl = _that._wheelEl;
        var _options = _that._options;
        if (_wheelEl) {
            var _wheelItems = _that._wheelItemsEl = _that._getElements(_options.wheelItemEl, _wheelEl);
            if (!_wheelItems || _wheelItems.length <= 0) {
                warn('can not resolve wheel item');
            }
        }
    };

    /**
     * 设置每个滚轮项的可视状态
     * @param {Number} angle 当前的角度
     */
    Wheel.prototype._initItemVisibility = function (angle) {
        var _that = this;
        var _options = _that._options;
        var _wheelItems = _that._wheelItemsEl;
        if (_wheelItems && _wheelItems.length > 0) {
            for (var i = 0; i < _wheelItems.length; i++) {
                var _wheelItem = _wheelItems[i];
                var _angle = _wheelItem._angle;
                var _offsetAngle = Math.abs(angle - _angle);
                if (_offsetAngle < _that._highlightRange) {
                    _wheelItem.classList.add(_options.activeCls);
                } else if (_offsetAngle < _that._visibleRange) {
                    _wheelItem.classList.add(_options.visibleCls);
                    _wheelItem.classList.remove(_options.activeCls);
                } else {
                    _wheelItem.classList.remove(_options.activeCls);
                    _wheelItem.classList.remove(_options.visibleCls);
                }
            }
        }
    };

    /**
     * 计算每个滚轮项的角度
     */
    Wheel.prototype._calcItemPosition = function () {
        var _that = this;
        var _wheelItems = _that._wheelItemsEl;
        var _options = _that._options;
        var _direction = _options.direction || 'vertical';
        if (_wheelItems && _wheelItems.length > 0) {
            for (var i = 0; i < _wheelItems.length; i++) {
                var _item = _wheelItems[i];
                if (_item) {
                    _that._endAngle = _that._itemAngle * i;
                    _item._index = i;
                    _item._angle = _that._endAngle;
                    _item.style[prefixStyle('transformOrigin')] = 'center center ' + -_that._r + 'px';
                    var _style = 'translateZ(' + _that._r + 'px)';
                    if (_direction === 'horizontal') {
                        _style += ' rotateY(' + _that._endAngle + 'deg)';
                    } else if (_direction === 'vertical') {
                        _style += ' rotateX(-' + _that._endAngle + 'deg)';
                    }
                    _item.style[prefixStyle('transform')] = _style;
                }
            }
        }
        _that._endExceed = _that._endAngle + DEFAULT_MAX_EXCEED;
    };

    /**
     * 获取dom元素
     * @param {String|HTMLElement} el dom元素对象/dom元素选择符
     * @param {HTMLElement} pEl 父元素
     * @returns {Array} 返回dom元素对象
     */
    Wheel.prototype._getElements = function (el) {
        var pEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

        var _res = void 0;
        if (el) {
            if (typeof el === 'string') {
                _res = pEl.querySelectorAll(el);
            } else if (typeof el.length !== 'number') {
                _res = [el];
            }
        } else if (pEl && pEl !== document && pEl.children && pEl.children.length > 0) {
            _res = pEl.children;
        }
        if (_res && !(_res instanceof Array) && _res.length < 1) {
            _res = [_res];
        }
        return _res || [];
    };
}

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * 自定义事件处理模块
 *
 * @export
 * @param {Function} Fn 构造函数
 */
function eventModule(Fn) {
    Fn.prototype.dispatchEvent = function (target, eventType, options) {
        if (target && target.tagName && eventType && typeof eventType === 'string') {
            var ev = document.createEvent(window && window.MouseEvent ? 'MouseEvents' : 'Event');
            ev.initEvent(eventType, true, false);
            ev._constructed = true;
            ev = extend(ev, options);
            target.dispatchEvent(ev);
        }
    };
    Fn.prototype.on = function (type, fn) {
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

        var _that = this;
        _that._events = _that._events || {};
        _that._events[type] = _that._events[type] || [];

        _that._events[type].push([fn, context]);
    };

    Fn.prototype.once = function (type, fn) {
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;
        // 绑定后执行一次就移除
        var _that = this;
        var fired = false;
        /**
         * 魔法函`
         *
         */
        function magic() {
            _that.off(type, magic);

            if (!fired) {
                fired = true;
                fn.apply(context, arguments);
            }
        }
        // 将参数中的回调函数挂载在magic对象的fn属性上,为了执行off方法的时候，暴露对应的函数方法
        magic.fn = fn;

        _that.on(type, magic);
    };

    Fn.prototype.off = function (type, fn) {
        // 移除
        var _that = this;
        var _events = _that._events[type];
        if (!_events) {
            return;
        }

        var count = _events.length;
        while (count--) {
            // 移除通过on或者once绑定的回调函数
            if (_events[count][0] === fn || _events[count][0] && _events[count][0].fn === fn) {
                _events[count][0] = undefined;
            }
        }
    };

    Fn.prototype.trigger = function (type) {
        // 执行事件
        var _that = this;
        var events = _that._events && _that._events[type];
        if (!events) {
            return;
        }

        var len = events.length;
        var eventsCopy = [].concat(toConsumableArray(events));
        for (var i = 0; i < len; i++) {
            var event = eventsCopy[i];

            var _event = slicedToArray(event, 2),
                fn = _event[0],
                context = _event[1];

            if (fn) {
                fn.apply(context, [].slice.call(arguments, 1));
            }
        }
    };
}

/**
 * Wheel 构造方法
 * @param {String|HTMLElement} el 滚轮的包裹元素对象
 * @param {Object} options 可选参数
 */
function Wheel(el, options) {
    var _that = this;
    el = _that._getElements(el)[0];
    if (!el) {
        warn('can not resolve wrapper dom');
    } else {
        _that._init(el, options);
    }
}

/**
 * Wheel的use方法
 * @param {Function|Object} fn 方法/对象
 * @param {Object} options 可选参数
 */
Wheel.use = function (fn, options) {
    if (fn instanceof Function) {
        fn(Wheel, options);
    } else if (fn && fn.default instanceof Function) {
        fn.default(Wheel, options);
    } else {
        warn('can not resolve the use module');
    }
};

Wheel.use(initModule);
Wheel.use(coreModule);
Wheel.use(domModule);
Wheel.use(eventModule);

Wheel.Version = '0.0.1';

exports['default'] = Wheel;
exports.Wheel = Wheel;

Object.defineProperty(exports, '__esModule', { value: true });

})));
