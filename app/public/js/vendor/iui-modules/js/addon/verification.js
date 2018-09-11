import $ from 'jquery'

/**
 * 手机验证码
 */
export default {
  verification : function verification(options) {
    var param = $.extend({
      container : 'body', // 传body进来;  $('body')
      field     : 'mobileCode', // 手机验证码字段
      scenario  : '2', // 验证场景(1-所有，2-新增，3-修改)
      mobile    : null, // 手机号码
      success   : null, // 成功的回调函数
      error     : null // 错误的回调函数
    }, options)

    var $container = param.container instanceof $ ? param.container : $(param.container)
    var csrf = $('meta[name="csrf-param"]').prop('content')
    var csrfVal = $('meta[name="csrf-token"]').prop('content')
    var activityId = $container.find('input[name="activityId"]').val()

    $.post('index/sms-code', csrf + '=' + csrfVal + '&field=' + param.field + '&scenario=' + param.scenario + '&activityId=' + activityId + '&mobile=' + param.mobile, function (res) {
      if (res.status === 1) {
        if (param.success) {
          param.success(res)
        }
      } else {
        if (param.error) {
          param.error(res)
        }
      }
    })
  }
}
