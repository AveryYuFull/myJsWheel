import isWeChatDevTools from './isWeChatDevTools';
import isBroswer from './isBrowser';
/**
 * 判断是否有touch事件
 * @returns {Boolean} 判读结果
 */
export default function isTouch () {
    return isBroswer() && ('ontouchstart' in window || isWeChatDevTools());
}
