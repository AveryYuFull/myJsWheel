let _vendor = (function () {
    const _dom = document.createElement('div').style;
    let _transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    };
    for (let key in _transformNames) {
        if (typeof _dom[_transformNames[key]] !== 'undefined') {
            return key;
        }
    }
    return false;
})();

/**
 * 过滤样式的key
 * @param {String} style 样式
 * @returns {String} 返回样式
 */
export default function prefixStyle (style) {
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
