/**
 * 手机归属地
 */
import $ from 'jquery'
export default {
  ownership : function ownership(options) {
    var param = $.extend({
      container : 'body', // 传body进来或者$('body')
      mobile    : null, // 手机号码
      before    : null, // 提交前的回调函数
      success   : null, // 成功的回调函数
      error     : null // 错误的回调函数
    }, options)

    var $container = param.container instanceof $ ? param.container : $(param.container)
    var csrf = $('meta[name="csrf-param"]').prop('content')
    var csrfVal = $('meta[name="csrf-token"]').prop('content')
    var activityId = $container.find('input[name="activityId"]').val()
    var _val = $container.find('#' + param.type).val()
    var ismobile = param.mobile ? param.mobile : _val
    var serialize = csrf + '=' + csrfVal + '&activityId=' + activityId + '&mobile=' + ismobile

    $.ajax({
      url        : '/index/mobile-info',
      type       : 'POST',
      data       : serialize,
      timeout    : 15000,
      beforeSend : function () {
        if (param.before) {
          param.before(XMLHttpRequest)
        }
      }
    }).then(function (res) {
      if (param.success) {
        param.success(res)
      }
    }, function (err) {
      if (param.error) {
        param.error(err)
      }
    })
  }
}
