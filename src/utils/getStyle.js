/**
 * 获取元素的样式
 * @param {HTMLElement} el dom元素
 * @param {String} prop 属性
 * @returns {Array|String} 返回样式
 */
export default function getStyle (el, prop) {
    if (!el) {
        return null;
    }
    let _res;
    if (window.getComputedStyle instanceof Function) {
        _res = window.getComputedStyle(el, null);
    } else {
        _res = el.currentStyle;
    }
    if (prop && _res) {
        _res = _res[prop];
    }
    return _res;
}
