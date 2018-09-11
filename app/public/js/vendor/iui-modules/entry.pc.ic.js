// require('./sass/pc/_entry.scss')
import $ from 'jquery'
import ajaxForm from './js/functional/ajaxForm' // 提交表单
import validate from './js/functional/validate' // 验证
import layer from './js/common/layer' // 弹层
import placeholder from './js/desktop/placeholder' // 文本框默认提示
import cityPicker from './js/desktop/cityPicker' // 城市
import dropdown from './js/desktop/dropdown' // 模拟下拉

import ajaxError from './js/addon/ajaxError' // 验证后台错误
import conversion from './js/addon/conversion' // 生日转为周岁年龄
import exist from './js/addon/exist' // 判断是否显示/隐藏邮箱、手机
import getQueryString from './js/addon/getQueryString' // 拿url参数
import ichecked from './js/addon/ichecked' // radio/checkbox
import ownership from './js/addon/ownership' // 手机归属地
import verification from './js/addon/verification' // 发送短信验证码
import alert from './js/common/alert' // 提示
import loading from './js/common/loading' // 加载
import cookie from './js/functional/cookie' // cookie
import pubsub from './js/functional/pubsub'
import tooltip from './js/desktop/tooltip'
var IUI = {}
// 注入到jQuery原型对象
$.each([
  ajaxForm,
  validate,
  layer,
  placeholder,
  cityPicker,
  dropdown
], function (index, component) {
  if (typeof component === 'object' && !IUI[component]) {
    $.extend(IUI, component)
  }
})

// 注入到jQuery全局对象
$.each([
  ajaxError,
  conversion,
  exist,
  getQueryString,
  ichecked,
  ownership,
  verification,
  alert,
  loading,
  cookie,
  pubsub,
  tooltip
], function (index, component) {
  $.extend(component)
})

// 调用插件
$.fn.IUI = function () {
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
