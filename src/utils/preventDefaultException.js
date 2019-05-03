/**
 * 判断是否允许阻止事件的默认行为
 * @param {HTMLElement} target 事件对象
 * @param {Object} options 可选参数
 */
export default function preventDefaultException (target, options) {
    if (!target) {
        return true;
    }
    options = options || {};
    for (let key in options) {
        if (options.hasOwnProperty(key)) {
            const _item = options[key];
            if (_item && _item.test instanceof Function &&
                _item.test(target[key])) {
                return true;
            }
        }
    }
    return false;
}
