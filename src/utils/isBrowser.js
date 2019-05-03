/**
 * 判断是否是浏览器环境
 * @returns {Boolean} 返回环境是否是浏览器
 */
export default function isBrowser () {
    return typeof window !== 'undefined';
}
