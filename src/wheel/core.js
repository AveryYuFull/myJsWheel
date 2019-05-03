import rad2deg from '../utils/rad2deg';
import eventUtil from '../utils/eventUtil';
import isTouch from '../utils/isTouch';
import { styleName, evtType, TOUCH_EVENT,
    EVENT_TYPE } from '../constants';
import preventDefaultException from '../utils/preventDefaultException';
import getNow from '../utils/getNow';
import { ease } from '../utils/ease';
import raf from '../utils/raf';
// import getStyle from '../utils/getStyle';
/**
 * 核心模块
 * @param {Wheel} Wheel Wheel构造方法
 */
export function coreModule (Wheel) {
    /**
     * 计算每个滚轮项的角度
     * @param {Number} c 滚轮项的宽度
     * @returns {Number} 返回每个item项的角度
     */
    Wheel.prototype._calcAngle = function (c) {
        const _that = this;
        let _a = parseFloat(_that._r);
        let _b = _a;
        c = Math.abs(c);
        let _intDeg = parseInt((c / _that._d)) * 180;
        c = c % _that._d;
        const _cosX = (_a * _a + _b * _b - c * c) / (2 * _a * _b);
        const _aCosX = Math.acos(_cosX);
        const _deg = rad2deg(_aCosX);
        return _intDeg + _deg;
    }

    /**
     * 初始化事件
     */
    Wheel.prototype._bindEvent = function (flag) {
        const _that = this;
        const _options = _that._options;
        const _target = _options.bindToWrapper ? _that._el : window;
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
    }

    /**
     * 事件处理方法
     * @param {Event} evt 事件对象
     */
    Wheel.prototype.handleEvent = function (evt) {
        const _that = this;
        evt = eventUtil.getEvent(evt);
        const _type = (evt && evt.type) || '';
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
    }

    /**
     * 开始
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._start = function (evt) {
        const _that = this;
        evt = eventUtil.getEvent(evt);
        const _type = (evt && evt.type) || '';
        const _evtType = evtType[_type];
        if (_evtType !== TOUCH_EVENT) {
            const _button = eventUtil.getButton(evt);
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
        _that.startTime = getNow();
        _that.moved = false;

        _that.trigger(EVENT_TYPE.BEFORE_SCROLL_START, {
            index: _that._getSelectedIndex()
        });
    }

    /**
     * 移动
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._move = function (evt) {
        const _that = this;
        evt = eventUtil.getEvent(evt);
        const _type = (evt && evt.type) || '';
        const _evtType = evtType[_type];
        const _options = _that._options;
        if (_that.initiated !== _evtType) {
            return;
        }

        _that._preventEvent(evt);

        const _curPos = _that._getPos(evt);
        const _delta = _curPos - _that.pointPos;
        _that.pointPos = _curPos;

        if (!_that.moved) {
            _that.trigger(EVENT_TYPE.SCROLL_START, {
                index: _that._getSelectedIndex()
            });
            _that.moved = true;
        }
        _that._scrollTo(_that._delta2deg(_delta));
        const _timestamp = getNow();
        if (_timestamp - _that.startTime > _options.momentumLimitTime) {
            _that.momentumLimitTime = _timestamp;
            _that.startPos = _curPos;
        }
    }

    /**
     * 结束
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._end = function (evt) {
        const _that = this;
        evt = eventUtil.getEvent(evt);
        const _options = _that._options;
        const _type = (evt && evt.type) || '';
        const _evtType = evtType[_type];
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
    }

    /**
     * 动画结束
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._transitionEnd = function (evt) {
        const _that = this;
        const _options = _that._options;
        const _target = eventUtil.getTarget(evt);
        if ((!_that.isInTransition && !_that.isAnimating) ||
            _target !== _that._wheelEl) {
            return;
        }

        const _cancelAnimationFrame = raf.cancelAnimationFrame;
        if (_options.useTransition) {
            _cancelAnimationFrame(_that.probeTimer);
            _that.isInTransition = false;
        } else {
            _that.isAnimating = false;
            _cancelAnimationFrame(_that.animateTimer);
        }
        _that._setTransition(0, null);
    }

    /**
     * reset位置
     * @param {Number} time 时长
     * @param {Object} easing 动画规则
     * @returns {Boolean} 是否重置成功
     */
    Wheel.prototype._resetPos = function (time, easing) {
        const _that = this;
        let _angle = _that._angle;
        if (_angle < _that._beginAngle) {
           _angle = _that._beginAngle; 
        } else if(_angle > _that._endAngle) {
            _angle = _that._endAngle;
        }

        if (_angle === _that._angle) {
            return false;
        }
        _that._scrollTo(_angle, time, easing);
        return true;
    }

    /**
     * 滚动到指定的位置
     * @param {Number} angle 新的角度
     * @param {Number} time 动画时长
     * @param {Object} easing 动画规则
     */
    Wheel.prototype._scrollTo = function (angle, time, easing) {
        const _that = this;
        const _options = _that._options;
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
    }

    /**
     * 滚动到指定的位置
     * @param {Number} angle 新的角度
     * @param {Number} time 动画时长
     * @param {Object} easing 动画规则
     */
    Wheel.prototype._animate = function (angle, time, easing) {
        const _that = this;
        time = time || 0;
        let _startTime = getNow();
        let _destTime = _startTime + time;
        const _caf = raf.cancelAnimationFrame;
        const _raf = raf.requestAnimationFrame;
        
        function _step () {
            let _nowTime = getNow();
            if (_nowTime >= _destTime) {
                _that._translateTo(angle);
                _that.dispatchEvent(_that._wheelEl, styleName.transitionEnd);
                return;
            }

            _nowTime = (_nowTime - _startTime) / time;
            let _newAngle = _that._angle + easing(_nowTime) * (angle - _that._angle);
            _that._translateTo(_newAngle);
            if (_that.isAnimating) {
                _that.animateTimer = _raf(_step);
            }
        }
        _caf(_that.animateTimer);
        _that.animateTimer = _raf(_step);
    }

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
        const _that = this;
        const _options = _that._options;
        const _wheelEl = _that._wheelEl;
        const _direction = _options.direction || 'vertical';
        if (_wheelEl) {
            let _style = '';
            if (_direction === 'horizontal') {
                _style = `rotateY(-${angle}deg)`;
            } else {
                _style = `rotateX(${angle}deg)`;
            }
            _wheelEl.style[styleName.transform] = _style;
            _that._angle = angle;
            _that._initItemVisibility(angle);
            _that.trigger(EVENT_TYPE.SCROLL, {
                index: _that._getSelectedIndex()
            });
        }
    }

    /**
     * 设置动画参数
     * @param {Number} time 动画时长
     * @param {String} easing 动画规则
     */
    Wheel.prototype._setTransition = function (time, easing) {
        const _that = this;
        time = time || 0;
        const _wheelEl = _that._wheelEl;
        if (_wheelEl) {
            _wheelEl.style[styleName.transitionDuration] = `${time}ms`;
            _wheelEl.style[styleName.transitionTimingFunction] = easing;
        }
    }

    /**
     * 将滑动距离转换为角度
     * @param {Number} delta 距离
     * @returns {Number} 返回角度
     */
    Wheel.prototype._delta2deg = function (delta) {
        const _that = this;
        let _deltaRange = _that._calcAngle(delta);
        let _newAngle = delta > 0 ? _that._angle - _deltaRange : _that._angle + _deltaRange;
        if (_newAngle < _that._beginExceed) {
            _newAngle = _that._beginExceed;
        } else if (_newAngle > _that._endExceed) {
            _newAngle = _that._endExceed;
        }
        return _newAngle;
    }

    /**
     * 获取当前的索引
     * @param {Number} angle 当前角度
     * @returns {Number} 返回当前的索引
     */
    Wheel.prototype._getSelectedIndex = function (angle) {
        const _that = this;
        const _angle = angle || _that._angle;
        const _itemAngle = _that._itemAngle;
        let _index = 0;
        if (_itemAngle) {
            _index = parseInt(_angle / _itemAngle);
            _index = Math.abs(_index);
            if (_index < 0) {
                _index = 0;
            } else if (_index > _that._wheelItemsEl.length - 1) {
                _index = _that._wheelItemsEl.length - 1;
            }
        }
        return  _index;
    }

    /**
     * 获取当前滚动的位置
     * @param {Event} evt 事件对象
     * @returns {Number} 返回位置
     */
    Wheel.prototype._getPos = function (evt) {
        const _that = this;
        const _options = _that._options;
        evt = eventUtil.getEvent(evt);
        const _point = evt.touches ? evt.touches[0] : evt;
        const _direction = _options.direction || 'vertical';
        let _pageAxes = _direction === 'horizontal' ? 'pageX' : 'pageY';
        return _point[_pageAxes];
    }

    /**
     * 阻止事件默认行为
     * @param {Event} evt 事件对象
     */
    Wheel.prototype._preventEvent = function (evt) {
        const _that = this;
        const _options = _that._options;
        evt = eventUtil.getEvent(evt);
        if (_options.preventDefault && 
            !preventDefaultException(eventUtil.getTarget(evt), _options.preventDefaultException)) {
            eventUtil.preventDefault(evt);
        }
        if (_options.stopPropagation) {
            eventUtil.stopPropagation(evt);
        }
    }

    /**
     * 滚动到指定的位置
     * @param {Number} index 索引
     */
    Wheel.prototype.wheelTo = function (index) {

    }

    /**
     * 监听是否在动画中
     */
    Wheel.prototype._watchTransition = function () {
        const _that = this;
        if (typeof Object.defineProperty === 'undefined') {
            return;
        }
        const _options = _that._options;
        let _isInTransition = false;
        let _key = _options.useTransition ? 'isInTransition' : 'isAnimating';
        Object.defineProperty(_that, _key, {
            get () {
                return _isInTransition;
            },
            set (nowVal) {
                _isInTransition = nowVal;
                let _elems = _that._wheelItemsEl ? _that._wheelItemsEl : [_that._wheelEl];
                let _pointerEvents = _isInTransition ? 'none' : 'auto';
                for (let i = 0; i < _elems.length; i++) {
                    const _el = _elems[i];
                    if (_el) {
                        _el.style.pointerEvents = _pointerEvents;
                    }
                }
            }
        })
    }
}
