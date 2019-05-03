import getNow from './getNow';

(function () {
    let _vendors = ['webkit', 'moz', 'o', 'ms'];
    let _lastTime = 0;
    for (let i = 0; i < _vendors.length && !window.requestAnimationFrame; i++) {
        const _prefix = _vendors[i];
        window.requestAnimationFrame = window[_prefix + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[_prefix + 'CancelAnimationFrame'] ||
            window[_prefix + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (cb) {
            let _nowTime = getNow();
            let _timeToCall = Math.max(0, 17 - (_nowTime - _lastTime));
            let _timeId = setTimeout(() => {
                if (cb instanceof Function) {
                    cb();
                }
            }, _timeToCall);
            _lastTime = _nowTime + _timeToCall;
            return _timeId;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
})();

export default {
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame
};
