import { initModule } from './wheel/init';
import { coreModule } from './wheel/core';
import { domModule } from './wheel/dom';
import { eventModule } from './utils/event';

import { warn } from './utils/debug';
/**
 * Wheel 构造方法
 * @param {String|HTMLElement} el 滚轮的包裹元素对象
 * @param {Object} options 可选参数
 */
function Wheel (el, options) {
    const _that = this;
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
        warn('can not resolve the use module')
    }
}

Wheel.use(initModule);
Wheel.use(coreModule);
Wheel.use(domModule);
Wheel.use(eventModule);

Wheel.Version = '0.0.1';

export default Wheel;
export {
    Wheel
};
