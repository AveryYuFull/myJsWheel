import delta2deg from './delta2deg';

/**
 * 开启动量计算
 * @param {Number} startPos 开始位置
 * @param {Number} curPos 当前位置
 * @param {Number} time 时间间隔
 * @param {Number} r 半径
 * @param {Number} angle 当前角度
 * @param {Number} lowMargin 最小距离
 * @param {Number} upMargin  最大距离
 * @param {Object} options 可选参数
 * @returns {Object} 返回距离
 */
export default function momentum (startPos, curPos, time, r, angle, lowMargin, upMargin, options) {
    let _speed =  (curPos - startPos) / time;
    const { swipeTime, swipeBounceTime, deceleration } = options;
    let _delta = _speed / deceleration;
    let _duration = swipeTime;
    let _newAngle = delta2deg(r, _delta, angle, lowMargin, upMargin);
    return {
        angle: _newAngle,
        duration: _duration
    };
}
