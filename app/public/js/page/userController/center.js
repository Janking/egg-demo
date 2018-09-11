module.exports = function () {
  if ($('#mod-usercenter').length === 0) {
    return false
  }
  let $addEmail = $('.add-email')
  let $updateEmail = $('.update-email')
  let $checkOldEmail = $('.form-checkOldEmail')
  let $setEmail = $('.form-setEmail')
  let checkOldEmail = $('#layer-check-user-email').IUI('layer', { offsetWidth: 700 })
  let createReviseEmail = $('#layer-user-email').IUI('layer', { offsetWidth: 700 })
  let $sendEmailCode = $('#reset-email-code')
  function countdown(elem, action = 1, second = 60, callback) {
    // 重置倒计时
    if (action === 0) {
      clearInterval(elem.data('countdownTimer'))
      elem.data('countdownSecond', second)
      elem.text(elem.data('countdownInitText'))
      elem.data('countdownStatus', false)
      return false
    } else if (action === 1 && elem.data('countdownStatus')) {
      // 正在倒计时，防重复点击
      return false
    } else {
      elem.data('countdownSecond', second)
      elem.data('countdownInitText', elem.text())
      elem.text(elem.data('countdownSecond') + '秒后重新发送')
      elem.data('countdownStatus', true)
      elem.data('countdownTimer', setInterval(function () {
        elem.data('countdownSecond', elem.data('countdownSecond', ) - 1)
        elem.text(elem.data('countdownSecond') + '秒后重新发送')
        if (elem.data('countdownSecond') === 0) {
          elem.text(elem.data('countdownInitText'))
          elem.data('countdownStatus', false)
          clearInterval(elem.data('countdownTimer'))
        }
      }, 1000))

      callback()
    }

  }

  function sendCode(event) {
    let $this = $(this)
    let $form = $this.closest('form')
    let url = $this.attr('data-url')
    let options = $form.serialize()
    countdown($this, 1, 60, function () {
      $.post(url, options).then(function (res) {
        if (res.code === 200) {
          $.alert({ text: '验证码已成功发送，请查收！', status: 3 })
        } else {
          countdown($this, 0)
          $.alert({ text: res.msg[0].value, status: 2 })
        }
      })
    })
  }


  $addEmail.on('click', function () { createReviseEmail.showLayer() })
  $updateEmail.on('click', function () { checkOldEmail.showLayer() })
  $sendEmailCode.on('click', sendCode)
  $checkOldEmail.IUI('ajaxForm', {
    success: function (res) {
      if (res.code === 200) {
        $checkOldEmail[0].reset()
        checkOldEmail.hideLayer()
        createReviseEmail.showLayer()
        $.alert({ text: '邮箱正确！', status: 3, timeout: 2000 })
      } else {
        $('[name="oldEmail"]').focus()
        $.alert({ text: '邮箱错误！', status: 2, timeout: 2000 })
      }
    }
  })
  $setEmail.IUI('ajaxForm', {
    success: function (res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 3,
          timeout: 2000,
          callback: function () {
            window.location.href = ''
          }
        })
      } else {
        $.alert({ text: res.msg[0].value, status: 2, timeout: 2000 })
      }
    }
  })



  let $addMobile = $('.add-mobile')
  let $updateMobile = $('.update-mobile')
  let $checkOldMobile = $('.form-checkOldMobile')
  let $reviseMobile = $('.form-reviseMobile')
  let $sendMobileCode = $('#reset-mobile-code')
  let checkOldMobile = $('#layer-check-user-mobile').IUI('layer', { offsetWidth: 700 })
  let createReviseMobile = $('#layer-user-mobile').IUI('layer', { offsetWidth: 700 })
  let createReviseResetMobile = $('#layer-user-resetmobile').IUI('layer', { offsetWidth: 700 })
  $sendMobileCode.on('click', sendCode)
  $updateMobile.on('click', function () { checkOldMobile.showLayer() })
  $addMobile.on('click', function () { createReviseResetMobile.showLayer() })
  $checkOldMobile.IUI('ajaxForm', {
    success: function (res) {
      if (res.code === 200) {
        $checkOldEmail[0].reset()
        checkOldMobile.hideLayer()
        createReviseResetMobile.showLayer()
        $.alert({ text: '手机号正确！', status: 3, timeout: 2000 })
      } else {
        $('[name="OldMobile"]').val('').focus()
        $.alert({ text: '手机号错误！', status: 2, timeout: 2000 })
      }
    }
  })
  $reviseMobile.IUI('ajaxForm', {
    success: function (res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 3,
          callback: function () {
            window.location.href = ''
          }
        })
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 2,
          timeout: 2000
        })
      }
    }
  })


  let createRevisePassword = $('#layer-user-password').IUI('layer', { offsetWidth: 700 })
  let checkOldPass = $('#layer-check-user-pass').IUI('layer', { offsetWidth: 700 })
  let $resetPass = $('.reset-password')
  let $sendPassCode = $('#reset-pass-code')
  let $verifyCodeByUpdatePass = $('.form-verifyCodeByUpdatePass')
  let $formSetPass = $('.form-advise-password')
  $resetPass.on('click', function () { checkOldPass.showLayer() })
  $sendPassCode.on('click', sendCode)
  $verifyCodeByUpdatePass.IUI('ajaxForm', {
    success: function (res) {
      $verifyCodeByUpdatePass[0].reset()
      if (res.code === 200) {
        checkOldPass.hideLayer()
        createRevisePassword.showLayer()
        $.alert({ text: '验证码正确！', status: 3, timeout: 2000 })
      } else {
        $.alert({ text: '验证码错误！', status: 2, timeout: 2000 })
      }
    }
  })

  $formSetPass.IUI('ajaxForm', {
    success: function (res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 3,
          timeout: 2000,
          callback: function () {
            window.location.href = ''
          }
        })
      } else {
        $.alert({ text: res.msg[0].value, status: 2, timeout: 2000 })
      }
    }
  })

}
