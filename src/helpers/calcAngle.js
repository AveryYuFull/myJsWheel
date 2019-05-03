import rad2deg from '../utils/rad2deg';
/**
 * 计算夹角
 * @param {Number} r 半径
 * @param {Number} c 第三条边的长度
 * @returns {Number} 返回半径和c这条边的夹角
 */
export default function calcAngle (r, c) {
    let _a = parseFloat(r);
    let _b = _a;
    c = Math.abs(c);
    let _d = r * 2;
    let _intDeg = parseInt((c / _d)) * 180;
    c = c % _d;
    const _cosX = (_a * _a + _b * _b - c * c) / (2 * _a * _b);
    const _aCosX = Math.acos(_cosX);
    const _deg = rad2deg(_aCosX);
    return _intDeg + _deg;
}
