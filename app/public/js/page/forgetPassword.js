var $form = $('.form-forget-password')
var $formMobile = $('.form-forget-mobile')
var $formEmail = $('.form-forget-email')
var $btnMobile = $('#reset-mobile-code')
var $btnEmail = $('#reset-email-code')
var setTime = 60
var setTime2 = 60
var timer = null
var timer2 = null
var url = {
  resetMobileCode: '/resetPass/smsCode/send', // 获取手机验证码接口
  resetMobile: '/resecode/check', // 提交手机找回密码
  resetEmailCode: '/resetPass/emailCode/send', // 获取邮箱验证码接口
  resetEmail: '/resetPass/emailCode/check' // 提交邮箱找回密码
}

$form.IUI('placeholder', {
  color: '#A3A3A3',
  zIndex: 1,
  top: 14,
  left: 65
})

$.tooltip()

if ($.cookie.get('51la_feedback') === '1') {
  $.alert({
    text: '您需要登录之后才能反馈问题哦~',
    status: 0,
    timeout: 2000,
    callback: function () {
      $.cookie.set('51la_feedback', null)
    }
  })
}

var validate = $form.IUI('validate', {
  strategy: {
    numChart: function (params) {
      var $target = this.self
      var value = $target[0].value
      if (!/^[a-zA-Z0-9\u4e00-\u9fa5]{4,16}/.test($.trim(value))) {
        return false
      }
    },
    confirmPass: function () {
      var $target = this.self
      var $form = $target.closest('form')
      var value = $.trim($form.find('[type="password"]').eq(0).val())
      var pass = $.trim($form.find('[type="password"]').eq(1).val())
      if (value !== pass) {
        return false
      }
    },
    httpReg: function () {
      var $target = this.self
      var value = $.trim($target[0].value)
      if (!/^((https|http)?:\/\/)[^\s]+/.test(value)) {
        return false
      }
    }
  },
  collections: [{
    required: 'newPass1',
    context: '.form-group',
    matches: {
      between: {
        errMsg: '密码长度为 4 - 16 位',
        range: [4, 16]
      }
    }
  }, {
    required: 'newPass2',
    context: '.form-group',
    matches: {
      between: {
        errMsg: '密码长度为 4 - 16 位',
        range: [4, 16]
      },
      confirmPass: {
        errMsg: '两次输入密码不一致'
      }
    }
  }]
})

// 验证手机找回密码
var validateMobile = $formMobile.IUI('validate', {
  collections: [{
    required: 'smsNum',
    context: '.form-group',
    matches: {
      isMobile: {
        errMsg: '请输入您正确的手机号码'
      }
    }
  }, {
    required: 'code',
    context: '.form-group',
    matches: {
      isNonEmpty: {
        errMsg: '验证码不能为空'
      }
    }
  }]
})
// 验证邮箱找回密码
var validateEmail = $formEmail.IUI('validate', {
  collections: [{
    required: 'account',
    context: '.form-group',
    matches: {
      isEmail: {
        errMsg: '请输入您正确的邮箱'
      }
    }
  }, {
    required: 'code',
    context: '.form-group',
    matches: {
      isNonEmpty: {
        errMsg: '验证码不能为空'
      }
    }
  }]
})

// 发送手机验证码
let sendForSms = true
$btnMobile.on('click', function () {
  if (!sendForSms) {
    return false
  }
  if (validateMobile.batch(false, ['smsNum']) === false || $(this).prop('disabled') === true) {
    return false
  }
  // 实例化图形验证
  var captcha1 = new TencentCaptcha('2069817081', function (response) {
    clearInterval(timer)
    $.post(url.resetMobileCode, {
      smsNum: $formMobile.find('[data-required="smsNum"]').val(),
      randstr: response.randstr,
      ticket: response.ticket,
      _csrf: $('[name="_csrf"]').val()
    }).then(function (res) {
      if (res.code !== 200) {
        validateMobile.changeStatus('smsNum', 2, res.msg[0].value)
        $btnMobile.text('获取验证码').prop('disabled', false)
        setTime = 60
        return false
      }

      $btnMobile.text(setTime + '秒后重新发送').prop('disabled', true)
      timer = setInterval(function () {
        setTime--
        if (setTime === 0) {
          $btnMobile.text('获取验证码').prop('disabled', false)
          clearInterval(timer)
          sendForSms = true
          setTime = 60
        } else {
          $btnMobile.text(setTime + '秒后重新发送').prop('disabled', true)
          sendForSms = false
        }
      }, 1000)
    })
  })
  // 显示验证码
  captcha1.show()
})
// 发送邮件验证码
$btnEmail.on('click', function () {
  if (validateEmail.batch(false, ['account']) === false || $(this).prop('disabled') === true) {
    return false
  }
  clearInterval(timer2)
  $.post(url.resetEmailCode, {
    account: $formEmail.find('[data-required="account"]').val(),
    _csrf: $('[name="_csrf"]').val()
  }).then(function (res) {
    if (res.code !== 200) {
      validateEmail.changeStatus('account', 2, res.msg[0].value)
      $btnEmail.text('获取验证码').prop('disabled', false)
      setTime2 = 60
      return false
    }
  })

  $btnEmail.text(setTime2 + '秒后重新发送').prop('disabled', true)
  timer2 = setInterval(function () {
    setTime2--
    if (setTime2 === 0) {
      $btnEmail.text('获取验证码').prop('disabled', false)
      clearInterval(timer2)
      setTime2 = 60
    } else {
      $btnEmail.text(setTime2 + '秒后重新发送').prop('disabled', true)
    }
  }, 1000)
})

$formMobile.IUI('ajaxForm', {
  before: function () {
    if (validateMobile.batch() === false) {
      return false
    }
  },
  success: function (res) {
    if (res.code === 200) {
      $.alert({
        text: '验证通过，请修改密码！',
        status: 3
      })
      creatForgetMobile.cutTo('#layer-resetPassword', '#layer-forgetMobile')
    } else {
      $.alert({
        text: res.msg[0].value,
        status: 0
      })
    }
  }
})

$formEmail.IUI('ajaxForm', {
  before: function () {
    if (validateEmail.batch() === false) {
      return false
    }
  },
  success: function (res) {
    if (res.code === 200) {
      $.alert({
        text: '验证通过，请修改密码！',
        status: 3
      })
      creatForgetEmail.cutTo('#layer-resetPassword', '#layer-forgetEmail')
    } else {
      $.alert({
        text: res.msg[0].value,
        status: 0
      })
    }
  }
})

$form.IUI('ajaxForm', {
  before: function () {
    if (validate.batch() === false) {
      return false
    }
  },
  success: function (res) {
    if (res.code === 200) {
      $.alert({
        text: '修改成功，请登录！',
        status: 3,
        callback: function () {
          window.location.href = '/login'
        }
      })
    } else {
      $.alert({
        text: res.msg[0].value,
        status: 0
      })
    }
  }
})

// 弹层
var creatForgetPassword = $('#layer-fogetPassword').IUI('layer', {
  offsetWidth: 420
})

var creatForgetMobile = $('#layer-forgetMobile').IUI('layer', {
  offsetWidth: 420
})

var creatForgetEmail = $('#layer-forgetEmail').IUI('layer', {
  offsetWidth: 420
})

var creatresePassword = $('#layer-resetPassword').IUI('layer', {
  offsetWidth: 420
})

$('body').find('.by-mobile').click(function () {
  creatForgetPassword.cutTo('#layer-forgetMobile', '#layer-fogetPassword')
  $('body').find('.ruturn-back').addClass('ruturn-back-mobile-1')
})

$('body').find('.by-email').click(function () {
  creatForgetPassword.cutTo('#layer-forgetEmail', '#layer-fogetPassword')
  $('body').find('.ruturn-back').addClass('ruturn-back-email-1')
})

$('body').find('.ruturn-back-mobile').click(function () {
  creatForgetPassword.cutTo('#layer-fogetPassword', '#layer-forgetMobile')
})

$('body').find('.ruturn-back-email').click(function () {
  creatForgetEmail.cutTo('#layer-fogetPassword', '#layer-forgetEmail')
})

$('body').find('.ruturn-back-mobile-1').click(function () {
  creatresePassword.cutTo('#layer-forgetMobile', '#layer-resetPassword')
})

$('body').find('.ruturn-back-email-1').click(function () {
  creatresePassword.cutTo('#layer-forgetEmail', '#layer-resetPassword')
})

if (window.location.href.indexOf('#forget') > 0) {
  creatForgetPassword.showLayer()
}

$('.btn-forgetPassword').on('click', function () {
  creatForgetPassword.showLayer()
})
