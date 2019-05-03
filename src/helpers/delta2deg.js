import calcAngle from './calcAngle';

/**
 * 将滑动距离转换为角度
 * @param {Number} r 半径
 * @param {Number} delta 距离
 * @param {Number} angle 当前的角度
 * @param {Number} lowMargin 最小范围
 * @param {Number} upMargin 最大边界
 * @returns {Number} 返回角度
 */
export default function delta2deg (r, delta, angle, lowMargin, upMargin) {
    let _deltaRange = calcAngle(r, delta);
    let _newAngle = delta > 0 ? angle - _deltaRange : angle + _deltaRange;
    if (_newAngle < lowMargin) {
        _newAngle = lowMargin;
    } else if (_newAngle > upMargin) {
        _newAngle = upMargin;
    }
    return _newAngle;
}
