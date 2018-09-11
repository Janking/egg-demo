// window.IUI_UTILS = require('./js/utils');

window.IUI = {}

// 注入到jQuery原型对象
// $.each([
//     require('./js/functional/ajaxForm'),
//     require('./js/functional/validate'),
//     require('./js/common/layer.js'),
//     require('./js/common/tabs'),
//     require('./js/desktop/placeholder'),
//     require('./js/desktop/emailSuffix'),
//     require('./js/desktop/typeCount'),
//     require('./js/desktop/pagination')

// ], function(index, component) {
//     if (typeof component === 'object' && !IUI[component]) {
//         $.extend(IUI, component);
//     }
// });

// // 注入到jQuery全局对象
// $.each([
//     require('./js/common/alert'),
//     require('./js/common/dialog'),
//     require('./js/common/loading'),
//     require('./js/functional/cookie'),
//     require('./js/functional/pubsub'),
//     require('./js/desktop/popover')
// ], function(index, component) {
//     $.extend(component);
// });

// 调用插件
$.fn.IUI = $.fn.IUI || function () {
  var arg = arguments
  var component = IUI[arguments[0]]
  if (component) {
    arg = Array.prototype.slice.call(arg, 1)
    return component.apply(this, arg)
  } else {
    $.error('Method ' + arguments[0] + ' does not exist on jQuery.IUI Plugin')
    return this
  }
}

module.exports = function (component, type) {
  if (type) {
    if (typeof component === 'object' && !IUI[component]) {
      $.extend(IUI, component)
    }
  } else {
    $.extend(component)
  }
}
