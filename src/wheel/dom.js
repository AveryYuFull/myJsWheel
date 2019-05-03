import { warn } from '../utils/debug';
import prefixStyle from '../utils/prefixStyle';
import { DEFAULT_MAX_EXCEED } from '../constants';
/**
 * dom操作模块
 * @param {Wheel} Wheel Wheel构造方法
 */
export function domModule (Wheel) {
    /**
     * 初始化滚轮元素
     * @param {HTMLElement} el 滚轮元素的包裹元素节点
     */
    Wheel.prototype._initEl = function (el) {
        const _that = this;
        const _options = _that._options;
        let _wheelEl = _that._wheelEl = _that._getElements(_options.wheelEl, el)[0];
        if (_wheelEl) {
            _that._bindEvent(true);
        }
    }

    /**
     * 获取滚轮列表项集合
     */
    Wheel.prototype._resetItems = function () {
        const _that = this;
        const _wheelEl = _that._wheelEl;
        const _options = _that._options;
        if (_wheelEl) {
            let _wheelItems = _that._wheelItemsEl = _that._getElements(_options.wheelItemEl, _wheelEl);
            if (!_wheelItems || _wheelItems.length <= 0) {
                warn('can not resolve wheel item');
            }
        }
    }

    /**
     * 设置每个滚轮项的可视状态
     * @param {Number} angle 当前的角度
     */
    Wheel.prototype._initItemVisibility = function (angle) {
        const _that = this;
        const _options = _that._options;
        const _wheelItems = _that._wheelItemsEl;
        if (_wheelItems && _wheelItems.length > 0) {
            for (let i = 0; i < _wheelItems.length; i++) {
                let _wheelItem = _wheelItems[i];
                let _angle = _wheelItem._angle;
                let _offsetAngle = Math.abs(angle - _angle);
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
    }

    /**
     * 计算每个滚轮项的角度
     */
    Wheel.prototype._calcItemPosition = function () {
        const _that = this;
        const _wheelItems = _that._wheelItemsEl;
        const _options = _that._options;
        const _direction = _options.direction || 'vertical';
        if (_wheelItems && _wheelItems.length > 0) {
            for (let i = 0; i < _wheelItems.length; i++) {
                const _item = _wheelItems[i];
                if (_item) {
                    _that._endAngle = _that._itemAngle * i;
                    _item._index = i;
                    _item._angle = _that._endAngle;
                    _item.style[prefixStyle('transformOrigin')] = `center center ${-_that._r}px`;
                    let _style = `translateZ(${_that._r}px)`;
                    if (_direction === 'horizontal') {
                        _style += ` rotateY(${_that._endAngle}deg)`;
                    } else if (_direction === 'vertical') {
                        _style += ` rotateX(-${_that._endAngle}deg)`;
                    }
                    _item.style[prefixStyle('transform')] = _style;
                }
            }
        }
        _that._endExceed = _that._endAngle + DEFAULT_MAX_EXCEED;
    }

    /**
     * 获取dom元素
     * @param {String|HTMLElement} el dom元素对象/dom元素选择符
     * @param {HTMLElement} pEl 父元素
     * @returns {Array} 返回dom元素对象
     */
    Wheel.prototype._getElements = function (el, pEl = document) {
        let _res;
        if (el) {
            if (typeof el === 'string') {
                _res = pEl.querySelectorAll(el);
            } else if (typeof el.length !== 'number') {
                _res = [el];
            }
        } else if (pEl && pEl !== document && pEl.children && pEl.children.length > 0) {
            _res = pEl.children;
        }
        if (_res && (!(_res instanceof Array) && _res.length < 1)) {
            _res = [_res];
        }
        return _res || [];
    }
}
