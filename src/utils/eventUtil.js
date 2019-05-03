/**
 * 添加事件处理程序
 * @param {HTMLElement} el 事件对象
 * @param {String} type 事件类型
 * @param {Function} fn 事件处理程序
 * @param {Boolean} capture 处理事件的时机（捕获/冒泡）
 */
function _addHandler (el, type, fn, capture) {
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
function _removeHandler (el, type, fn, capture) {
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
function _preventDefault (evt) {
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
function _getTarget (evt) {
    let res = null;
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
function _stopPropagation (evt) {
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
function _getButton (evt) {
    let res;
    if (evt) {
        const _button = evt.button + '';
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
function _initEventListener (el, types, fn, flag, capture = false) {
    if (!el || !types || !fn) {
        return false;
    }

    capture = capture || false;
    flag = !flag ? 'remove' : 'add';

    if (!(types instanceof Array)) {
        types = [types];
    }
    types.forEach(type => {
        _initEvent(type);
    });

    return true;

    /**
     * 添加／解除事件监听器
     * @param {String} type 事件类型
     */
    function _initEvent (type) {
        let _fn = null;
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

export default {
    initEventListener: _initEventListener,
    addHandler: _addHandler,
    removeHandler: _removeHandler,
    getEvent: _getEvent,
    getTarget: _getTarget,
    getButton: _getButton,
    preventDefault: _preventDefault,
    stopPropagation: _stopPropagation
};
