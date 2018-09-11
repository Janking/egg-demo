require('./sass/mobile/_entry.scss');

window.IUI_UTILS = require('./js/utils');

var IUI = {};

// 注入到jQuery原型对象
$.each([
    require('./js/common/layer.js'),
    require('./js/mobile/mPickerBeta.js'),
    require('./js/functional/ajaxForm'),
    require('./js/functional/validate')
], function (index, component) {
    if (typeof component === 'object' && !IUI[component]) {
        $.extend(IUI, component);
    }
});

// 注入到jQuery全局对象
$.each([
    require('./js/functional/cookie'),
    require('./js/functional/pubsub'),
    require('./js/common/loading'),
    require('./js/common/alert'),
    require('./js/addon/ajaxError'),
    require('./js/addon/conversion'),
    require('./js/addon/exist'),
    require('./js/addon/getQueryString'),
    require('./js/addon/ichecked'),
    require('./js/addon/ownership'),
    require('./js/addon/verification')
], function (index, component) {
    $.extend(component);
});

// 调用插件
$.fn.IUI = function () {
    var arg = arguments;
    var component = IUI[arguments[0]];
    if (component) {
        arg = Array.prototype.slice.call(arg, 1);
        return component.apply(this, arg);
    } else {
        $.error('Method ' + arguments[0] + ' does not exist on jQuery.IUI Plugin');
        return this;
    }
};
