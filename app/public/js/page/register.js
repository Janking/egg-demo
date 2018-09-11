var $form = $('.form-register')
var btnCode = $('#TencentCaptcha')
var setTime = 60
// var request  = null
var sendSms = true

// 实例化图形验证
var captcha1 = new TencentCaptcha('2069817081', function (response) {
  if (response.ret !== 0) return false
  btnCode.text('发送中...').addClass('btn-disabled').prop('disabled', true)
  var timer
  $.post(url.smsNumUrl, {
    smsNum: $form.find('[data-required="smsNum"]').val(),
    randstr: response.randstr,
    ticket: response.ticket,
    _csrf: $('[name="_csrf"]').val()
  }, function (res) {
    if (res.code === 200) {
      $.alert({
        status: 3,
        text: '发送成功'
      })
      timer = setInterval(function () {
        setTime--
        if (setTime === 0) {
          btnCode.text('获取验证码').removeClass('btn-disabled').prop('disabled', false)
          sendSms = true
          clearInterval(timer)
          setTime = 60
        } else {
          sendSms = false
          btnCode.text(setTime + '秒后重新发送')
        }
      }, 1000)
    } else {
      $.alert({
        status: 2,
        text: res.msg[0].value
      })
      btnCode.prop('disabled', false).text('获取验证码').css('cursor', 'pointer')
    }
  })
})

// 获取链接上的参数
function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return null
}
// 如果引流过来手机，则填上
var $mobile = GetQueryString('smsNum')
if ($mobile) {
  $form.find('[name="smsNum"]').val($mobile)
}

var url = {
  nameExist: '/checkUserNameUsable', // 用户名是否重复接口
  email: '/user/email/usable', // 邮箱是否重复接口
  mobile: '/checkUserSmsNumUsable', // 手机是否重复接口
  smsNumUrl: '/reg/code' // 手机验证码
}

$form.IUI('placeholder', {
  color: '#A3A3A3',
  zIndex: 1,
  top: 0,
  left: 12
})

var validate = $form.IUI('validate', {
  strategy: {
    confrimPass: function () {
      var $target = this.self
      var value = $.trim($target[0].value)
      var pass = $.trim($('input[name="pass"]').val())
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
    },
    numChart: function () {
      var $target = this.self
      var value = $.trim($target[0].value)
      if (!/^[A-Za-z0-9_]{4,16}$/.test(value)) {
        return false
      }
    }
  },
  collections: [{
    required: 'name',
    context: '.form-group',
    matches: {
      isNonEmpty: {
        errMsg: '用户名不能为空'
      },
      numChart: {
        errMsg: '只支持英文字母，数字，下划线，4~16位字符'
      }
    }
  }, {
    required: 'smsNum',
    context: '.form-group',
    matches: {
      isNonEmpty: {
        errMsg: '手机号码不能为空'
      },
      isMobile: {
        errMsg: '手机号码格式不正确'
      }
    }
  }, {
    required: 'pass',
    context: '.form-group',
    matches: {
      between: {
        errMsg: '密码长度为 4 - 16 位',
        range: [4, 16]
      }
    }
  }, {
    required: 'pass2',
    context: '.form-group',
    matches: {
      between: {
        errMsg: '密码长度为 4 - 16 位',
        range: [4, 16]
      },
      confrimPass: {
        errMsg: '两次输入密码不一致'
      }
    }
  },
  {
    required: 'code',
    context: '.form-group',
    matches: {
      isNonEmpty: {
        errMsg: '验证码不能为空'
      }
    }
  }, {
    required: 'rule',
    context: 'label',
    matches: {
      isChecked: {
        errMsg: '请同意服务条款'
      }
    }
  }]
})

function failMsg(res, validate) {
  var errors = res.msg || [{
    name: 'global',
    value: res.msg
  }]
  $.each(errors, function (key, item) {
    validate.changeStatus(item.name, 2, item.value)
  })
}

$form.IUI('ajaxForm', {
  before: function () {
    if (validate.batch() === false) {
      return false
    }
    $('button[type="submit"]').addClass('btn-disabled').prop('disabled', true)
  },
  success: function (res) {
    if (res.code === 200) {
      $.alert({
        status: 3,
        text: '注册成功，请登录',
        timeout: 2000,
        callback: function () {
          window.location.href = '/login'
        }
      })
    } else {
      $('button[type="submit"]').removeClass('btn-disabled').prop('disabled', false)
      failMsg(res, validate)
    }
  },
  error: function (msg) {
    $.alert({
      obj: '#message',
      text: '<span style="margin-right:10pxfont-size:14px">数据提交失败，请稍候再试！</span>',
      status: 0,
      timeout: 2000
    })
  }
})
// 用户名是否重复
var userNameCode
var userSmsCode = ''
$form.on('validate.blur', '[data-required="name"]', function (event, valid) {
  if ($(this).data('validateStatus') === 1) {
    $.post(url.nameExist, {
      name: this.value,
      _csrf: $('[name="_csrf"]').val()
    }).then(function (res) {
      userNameCode = res
      if (res.code === 200) {
        if (res.data === false) {
          validate.changeStatus('name', 2, '用户名已被占用，请换一个试试')
        } else {
          validate.changeStatus('name', 1)
        }
      } else if (res.code === 444) {
        validate.changeStatus('name', 2, res.msg)
      }
    })
  }
})
// 手机是否重复
$form.on('validate.blur', '[data-required="smsNum"]', function (event, valid) {
  if ($(this).data('validateStatus') === 1) {
    $.post(url.mobile, {
      smsNum: this.value,
      _csrf: $('[name="_csrf"]').val()
    }).then(function (res) {
      userSmsCode = res
      if (res.code === 200) {
        if (res.data === false) {
          validate.changeStatus('smsNum', 2, '手机已被占用，请换一个试试')
        } else {
          validate.changeStatus('smsNum', 1)
        }
      } else if (res.code === 444) {
        validate.changeStatus('smsNum', 2, res.msg)
      }
    })
  }
})
// 发送手机验证码
btnCode.on('click', function () {
  if (!sendSms) {
    return false
  }
  if (validate.batch(false, ['name', 'smsNum', 'pass', 'pass2']) === false) {
    return false
  } else if (userNameCode.code === 200 && userNameCode.data === false) {
    validate.changeStatus('name', 2, '用户名已被占用，请换一个试试')
    return false
  } else if (userSmsCode.code === 200 && userSmsCode.data === false) {
    validate.changeStatus('smsNum', 2, '手机已被占用，请换一个试试')
    return false
  }
  // 显示验证码
  captcha1.show()
})
