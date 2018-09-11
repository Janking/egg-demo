// require('./sass/pc/_entry.scss');
let $ = require('jquery')
var LAUI = {}
// 注入到jQuery原型对象
$.each([
  require('./js/functional/ajaxForm'),
  require('./js/functional/validate'),
  require('./js/common/layer.js')
  // require('./js/common/tabs'),
  // require('./js/desktop/placeholder'),
  // require('./js/desktop/emailSuffix'),
  // require('./js/desktop/typeCount'),
  // require('./js/desktop/pagination'),
  // require('./js/desktop/tokenize'),
  // require('./js/desktop/intercept'),
  // require('./js/desktop/idate/index'),
  // require('./js/desktop/idate/range'),
  // require('./js/desktop/idate/time'),
  // require('./js/desktop/tree'),
  // require('./js/complex/table'),
  // require('./js/desktop/dropdown')
], function (index, component) {
  if (typeof component === 'object' && !LAUI[component]) {
    $.extend(LAUI, component)
  }
})

// 注入到jQuery全局对象
$.each([
  require('./js/common/alert'),
  require('./js/common/dialog'),
  require('./js/common/loading'),
  require('./js/functional/cookie'),
  require('./js/functional/pubsub'),
  require('./js/desktop/tooltip')
  // require('./js/desktop/popover'),
  // require('./js/desktop/inlineEditor'),
  // require('./js/common/slippage')
], function (index, component) {
  $.extend(component)
})

// 调用插件
$.fn.LAUI = function () {
  var arg = arguments
  var component = LAUI[arguments[0]]
  if (component) {
    arg = Array.prototype.slice.call(arg, 1)
    return component.apply(this, arg)
  } else {
    $.error('Method ' + arguments[0] + ' does not exist on jQuery.LAUI Plugin')
    return this
  }
}
