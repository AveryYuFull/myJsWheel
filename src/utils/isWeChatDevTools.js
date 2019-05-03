import isBrowser from './isBrowser';
/**
 * 判断是否是微信开发者工具
 * @returns {Boolean} 返回是否是微信开发者工具
 */
export default function isWeChatDevTools () {
    if (!isBrowser()) {
        return false;
    }
    let _ua = navigator.userAgent || '';
    _ua = _ua.toLowerCase();
    return /wechatdevtools/.test(_ua);
}
