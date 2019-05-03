/**
 * 获取当前时间
 *
 * @export
 * @returns {Number} 时间戳
 */
export function getNow() {
    return window.performance && window.performance.now ? (window.performance.now() + window.performance.timing.navigationStart) : +new Date();
}

/**
 * 拷贝对象
 *
 * @export
 * @param {Object} target 默认对象
 * @param {Object} rest 被拷贝的对象
 * @returns {Object} target
 */
export function extend(target, ...rest) {
    let isDeep = true;
    let n = 0;
    if (rest && rest.length < 1) {
        return typeof target === 'boolean' ? {} : target;
    }
    if (typeof target === 'boolean') {
        isDeep = target;
        target = rest[0];
        n = 1;
    }
    for (let i = (0 + n); i < rest.length; i++) {
        let source = rest[i];
        if (source instanceof Object) {
            for (let key in source) {
                if (isDeep && source[key] instanceof Object) {
                    target[key] = extend((source[key] instanceof Array) ? [] : {}, source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}
