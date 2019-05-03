import isTouch from './utils/isTouch';
import prefixStyle from './utils/prefixStyle';
/**
 * 默认配置信息
 */
export const DEFAULT_CONFIG = {
    wheelEl: '', // 滚轮列表: 元素列表，元素的选择符（如果为空，则选择el的第一个子元素）
    wheelItemEl: '', // 滚轮列表项元素：元素列表，元素的选择符（如果为空，则取wheelEl的子元素列表）
    direction: 'vertical', // 滚轮方向
    blurWidth: 20, // 留边距离
    itemWidth: 0, // 列表项宽度
    itemHeight: 0, // 列表项的高度
    activeCls: 'active', // 活动class
    visibleCls: 'visible', // 可视的class
    selectedIndex: 0, // 默认选中项
    bindToWrapper: false, // 是否将事件绑定在滚轮包裹元素上
    disableMouse: isTouch(), // 是否隐藏mouse事件
    disableTouch: !isTouch(), // 是否隐藏touch事件
    preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
    },
    preventDefault: true, // 是否允许阻止事件的默认行为
    stopPropagation: true, // 是否允许阻止事件冒泡
    momentum: true, // 是否开启momentum动画
    momentumLimitTime: 300, // 只有在屏幕快速滑动的时间小于momentumLimitTime才开启momentum动画
    momentumLimitDistance: 15, // 只有在屏幕快速滑动的距离大于momentumLimitDistance才开启momentum动画
    useTransition: false, // 是否使用transition
    bounceTime: 70, // 回弹动画时长
    deceleration: 0.001, // 减速度
    swipeTime: 250, // momentum动画时长
    swipeBounceTime: 50 // momentum动画回弹时长
}

/**
 * 列表项默认宽度
 */
export const DEFAULT_ITEM_WIDTH = 100;

/**
 * 列表项默认高度
 */
export const DEFAULT_ITEM_HEIGHT = 40;

/**
 * 最大可以超过的角度
 */
export const DEFAULT_MAX_EXCEED = 30;

/**
 * 可视范围
 */
export const VISIBLE_RANGE = 90;

/**
 * css3动画样式
 */
export const styleName = {
    transform: prefixStyle('transform'),
    transformOrigin: prefixStyle('transformOrigin'),
    transition: prefixStyle('transition'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionEnd: prefixStyle('transitionEnd')
}

/**
 * touch事件
 */
export const TOUCH_EVENT = 0;

/**
 * mouse事件
 */
export const MOUSE_EVENT = 1;

/**
 * 事件类型
 */
export const evtType = {
    touchstart: TOUCH_EVENT,
    touchmove: TOUCH_EVENT,
    touchcancel: TOUCH_EVENT,
    touchend: TOUCH_EVENT,

    mousedown: MOUSE_EVENT,
    mousemove: MOUSE_EVENT,
    mousecancel: MOUSE_EVENT,
    mouseup: MOUSE_EVENT
};

/**
 * 移动方向
 */
export const MOVING_DIRECTION = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
};

/**
 * 事件类型
 */
export const EVENT_TYPE = {
    BEFORE_SCROLL_START: 'beforeScrollStart',
    SCROLL_START: 'scrollStart',
    SCROLL: 'scroll',
    TOUCH_END: 'touchEnd',
    SCROLL_END: 'scrollEnd'
};
