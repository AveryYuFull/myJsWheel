/**
 * 获取当前时间戳
 * @returns {Number} 返回当前的时间戳
 */
export default function getNow () {
    let _res;
    if (window && window.performance && window.performance.now) {
        _res = window.performance.now() + window.performance.timing.navigationStart;
    } else {
        _res = Date.now();
    }
    return _res;
}
