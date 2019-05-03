import {extend} from '../utils/extend';
import { DEFAULT_CONFIG, DEFAULT_ITEM_HEIGHT, DEFAULT_ITEM_WIDTH,
    DEFAULT_MAX_EXCEED, VISIBLE_RANGE } from '../constants';
import calcAngle from '../helpers/calcAngle';
/**
 * 初始化模块
 * @param {Wheel} Wheel Wheel构造方法
 */
export function initModule (Wheel) {
    /**
     * 刷新
     */
    Wheel.prototype.refresh = function () {
        const _that = this;
        const _el = _that._el;
        const _options = _that._options;
        
        _that._resetItems();
        
        let _width = (_el && _el.offsetWidth) || 0;
        let _height = (_el && _el.offsetHeight) || 0;
        let _direction = _options.direction || 'vertical';

        let _sizeParams;
        let _defaultSize;
        if (_direction === 'horizontal') {
            _that._r = _width / 2 - _options.blurWidth;
            _defaultSize = DEFAULT_ITEM_WIDTH;
            _sizeParams = 'Width';
        } else if (_direction === 'vertical') {
            _that._r = _height / 2 - _options.blurWidth;
            _defaultSize = DEFAULT_ITEM_HEIGHT;
            _sizeParams = 'Height';
        }
        const _wheelItems = _that._wheelItemsEl;
        const _wheelItem = _wheelItems && _wheelItems[0];
        _that._itemSize = _options['item' + _sizeParams] || (_wheelItem && _wheelItem['offset' + _sizeParams]) || _defaultSize;
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
    }

    /**
     * 初始化方法
     * @param {HTMLElement} el 元素节点
     * @param {Object} options 可选参数
     */
    Wheel.prototype._init = function (el, options) {
        const _that = this;
        _that._el = el;
        _that._initOptions(options);
        _that._initEl(el);
        _that.refresh();
        _that._watchTransition();
        _that.index = _that._options.selectedIndex;
        _that.index > 0 && _that.wheelTo(_that.index);
    }

    /**
     * 初始化options参数
     * @param {Object} options 可选参数
     */
    Wheel.prototype._initOptions = function (options) {
        const _that = this;
        _that._options = extend({}, DEFAULT_CONFIG, options);
    }
}