module.exports = function () {
  /**
  * 修改用户选项
  */
  $('.form-userOption').IUI('ajaxForm', {
    success(res) {
      if (res.code === 200) {
        $.alert({
          text    : '修改成功！',
          status  : 3,
          timeout : 2000,
          callback() {
            window.location.href = window.location.href
          }
        })
      } else {
        $.alert({
          text   : res.msg[0].value,
          status : 0
        })
      }
    }
  })

  /**
  * 修改密码和邮箱
  */
  if ($('.form-resetPassword').length) {
    var resetPwdValidate = $('.form-resetPassword').IUI('validate', {
      strategy : {
        confrimPass : function () {
          var $target = this.self
          var value = $.trim($target[0].value)
          var pass = $.trim($('input[name="newPass1"]').val())
          if (value !== pass) {
            return false
          }
        }
      },
      collections : [{
        required : 'oriPass',
        context  : '.col-5',
        matches  : {
          isNonEmpty : {
            errMsg : '原始密码不能为空'
          },
          between : {
            errMsg : '密码长度为 4 - 16 位',
            range  : [4, 16]
          }
        }
      }, {
        required : 'newPass',
        context  : '.col-5',
        matches  : {
          isNonEmpty : {
            errMsg : '新密码不能为空'
          },
          between : {
            errMsg : '密码长度为 4 - 16 位',
            range  : [4, 16]
          }
        }
      }, {
        required : 'newPass2',
        context  : '.col-5',
        matches  : {
          isNonEmpty : {
            errMsg : '新密码不能为空'
          },
          between : {
            errMsg : '密码长度为 4 - 16 位',
            range  : [4, 16]
          },
          confrimPass : {
            errMsg : '两次密码输入不一致'
          }
        }
      }]
    })

    var updateEmailValidate = $('.form-updateEmail').IUI('validate', {
      collections : [{
        required : 'pass',
        context  : '.col-5 ',
        matches  : {
          isNonEmpty : {
            errMsg : '密码不能为空'
          },
          between : {
            errMsg : '密码长度为 4 - 16 位',
            range  : [4, 16]
          }
        }
      }, {
        required : 'email',
        context  : '.col-5 ',
        matches  : {
          isNonEmpty : {
            errMsg : '邮箱不能为空'
          },
          isEmail : {
            errMsg : '请输入您正确的邮箱'
          }
        }
      }]
    })
  }

  $('.form-updateEmail').IUI('ajaxForm', {
    before : function (event, config) {
      if (updateEmailValidate.batch() === false) {
        return false
      }
    },
    success : function (res) {
      if (res.code === 200) {
        $.alert({
          text   : ' 邮箱已更新，请前往邮箱点击激活链接完成修改。',
          status : 1
        })
      } else {
        $.alert({
          text   : res.msg[0].value,
          status : 0
        })
      }
    },
    error : function (errMsg, config) {
      $.alert({
        text   : '数据提交失败，请稍候再试！',
        status : 0
      })
    }
  })

  $('.form-resetPassword').IUI('ajaxForm', {
    before : function (event, config) {
      if (resetPwdValidate.batch() === false) {
        return false
      }
    },
    success : function (res) {
      if (res.code === 200) {
        $.alert({
          text   : '修改成功！',
          status : 1
        })
      } else {
        $.alert({
          text   : res.msg[0].value,
          status : 0
        })
      }
    },
    error : function (errorMsg, config) {
      $.alert({
        obj    : '#message',
        text   : '数据提交失败，请稍候再试！',
        status : 0
      })
    }
  })
}
