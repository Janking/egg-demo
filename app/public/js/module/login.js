module.exports = function () {
  // var uId = ''
  if ($('.form-login').length === 0) {
    return false
  }
  let context = $('.form-login').attr('role') === 'independent' ? '.col-3' : '.form-group'
  var validate = $('.form-login').IUI('validate', {
    strategy : {
      nameValid : function() {
        // this => validate object
        // params => {errMsg:'用户名已被占用，请重新命名',x:1,y:2,z:3}
        // 校验条件不通过必须 return false;
        let value = this.self[0].value
        if (value.indexOf('@') > -1) {
          return false
        }
      }
    },
    collections : [{
      required : 'name',
      context  : context,
      matches  : {
        isNonEmpty : {
          errMsg : '账号不能为空'
        },
        nameValid : {
          errMsg : '不支持邮箱登录，请输入用户名或手机号码'
        }
      }
    }, {
      required : 'pass',
      context  : context,
      matches  : {
        isNonEmpty : {
          errMsg : '密码不能为空'
        }
      }
    }]
  })

  $('.form-login').IUI('ajaxForm', {
    before() {
      if (validate.batch() === false) { return false }
    },
    success(res) {
      if (res.code === 200) {
        // $.cookie.set('51lastat', res.data, { path: '/', domain: '.51.la' })
        window.location.href = '/user/site/index'
      } else if (res.code === 444 && res.msg[0].value === '手机号码未绑定') {
        // uId = res.uId
        activeSmsnum()
      } else if (res.code === 444 && res.msg[0].value === '邮箱未验证，请先激活!') {
        activeAccount()
      } else {
        $.alert({
          text   : res.msg[0].value,
          status : 0
        })
      }
    }
  })

  $('.form-login').IUI('placeholder', {
    color  : '#A3A3A3',
    zIndex : 1,
    top    : 14,
    left   : 40
  })

  function activeAccount() {
    var activeAccountTemplate = `<div class="layer-header clearfix">
      <div class="pull-left"><div class="layer-title">请先激活您的账号</div></div>
      <div class="pull-right"><a href="javascript:" class="btn-close icon-close"></a></div>
    </div>
    <div class="layer-body">
        <form action="/user/email/register" class="form-activation c-form-vertical">
            <div class="form-group">
                <input type="text" name="name" class="form-control" placeholder="用户名" data-required="name" value="" >
            </div>
            <div class="form-group">
                <input type="text" name="email" class="form-control" placeholder="邮箱" data-required="email">
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-fluid mt20">发送激活邮件</button>
            </div>
        </form>
    </div>`
    var activationLayer = $('#layer-activation').IUI('layer', {
      content     : activeAccountTemplate,
      offsetWidth : 500,
      dynamic     : true,
      cancelCall  : function () {
        window.location.href = window.location.href
      }
    })

    activationLayer.showLayer()

    var activationValidate = $('.form-activation').IUI('validate', {
      collections : [{
        required : 'name',
        context  : '.form-group',
        matches  : {
          isNonEmpty : {
            errMsg : '请输入注册时填写的用户名'
          }
        }
      }, {
        required : 'email',
        context  : '.form-group',
        matches  : {
          isNonEmpty : {
            errMsg : '请输入注册时填写的邮箱'
          },
          isEmail : {
            errMsg : '请输入正确的邮箱地址'
          }
        }

      }]
    })

    $('.form-activation').IUI('ajaxForm', {
      before() {
        if (activationValidate.batch() === false) {
          return false
        }
      },
      success(res) {
        if (res.code === 200) {
          activationLayer.hideLayer()
          $.alert({
            text   : '邮件已重新发送，请查收！',
            status : 1
          })
        } else {
          $.alert({
            text   : res.msg[0].value,
            status : 0
          })
        }
      }
    })
  }

  function activeSmsnum() {
    var activeAccountTemplate = `<div class="layer-header clearfix">
      <div class="pull-left"><div class="h1 fb">提示</div></div>
      <div class="pull-right"><a href="javascript:" class="btn-close icon-close"></a></div>
    </div>
    <div class="layer-body">
        <div class="tc h3">
          按照<a target="_blank" href="http://www.miit.gov.cn/n1146295/n1146557/n1146614/c5345009/content.html">《中华人民共和国网络安全法》</a>要求，即日起需对我要啦统计网站注册用户进行实名认证。所有注册用户需将账户和手机号码进行绑定，未进行手机号绑定的用户在2018年6月30日后将会影响账户正常使用。
        </div>
        <div class="mt20 tc"><a href="/user/usercenter" class="btn btn-primary">前往补充手机号码</a></div>
    </div>
    <div class="layer-footer clearfix">
      <div class="pull-right">
        <a href="http://new.51.la/news/detail?id=165&from=list" target="_blank">点击了解详情</a>
      </div>
    </div>`
    var activationLayer = $('#layer-activation').IUI('layer', {
      content     : activeAccountTemplate,
      offsetWidth : 700,
      dynamic     : true,
      cancelCall  : function () {
        window.location.href = '/user/usercenter'
      }
    })

    activationLayer.showLayer()

    // 验证是否输入手机号码，输入正确手机号码即可以点击（设置手机号码）
    var $vlidMobileBtn = $('#mobile-code')
    $('.form-activation').find('[data-required="smsNum"]').on('keyup', function () {
      $vlidMobileBtn.prop('disabled', !/^1[34578]\d{9}$/.test($(this).val()))
    }).on('blur', function () {
      $vlidMobileBtn.prop('disabled', !/^1[34578]\d{9}$/.test($(this).val()))
    })

    // 发送设置手机验证码（未绑定手机号码）
    var setTime1 = 60
    $vlidMobileBtn.on('click', function () {
      $(this).text(setTime1 + '秒后重新发送').prop('disabled', true).css('cursor', 'not-allowed')
      $.post('/smsNum/update/code', {
        smsNum : $('.form-activation').find('[data-required="smsNum"]').val()
      }).then(function (res) {
        if (res.code !== 200) {
          $.alert({
            text    : res.msg[0].value,
            status  : 2,
            timeout : 3000
          })
        }
      })
      var timer = setInterval(function () {
        setTime1--
        if (setTime1 === 0) {
          $vlidMobileBtn.text('获取验证码').prop('disabled', false).css('cursor', 'pointer')
          clearInterval(timer)
          setTime1 = 60
        } else {
          $vlidMobileBtn.text(setTime1 + '秒后重新发送')
        }
      }, 1000)
    })

    var validateMobile = $('.form-activation').IUI('validate', {
      collections : [{
        required : 'smsNum',
        context  : '.form-group',
        matches  : {
          isMobile : {
            errMsg : '请输入您正确的手机号码'
          }
        }
      }, {
        required : 'code',
        context  : '.form-group',
        matches  : {
          isNonEmpty : {
            errMsg : '验证码不能为空'
          }
        }
      }]
    })

    $('.form-activation').IUI('ajaxForm', {
      before() {
        if (validateMobile.batch() === false) {
          return false
        }
      },
      success(res) {
        if (res.code === 200) {
          activationLayer.hideLayer()
          $.alert({
            text   : '已绑定成功，请重新登录',
            status : 3
          })
          activationLayer.hideLayer()
        } else {
          $.alert({
            text   : res.msg[0].value,
            status : 0
          })
        }
      }
    })
  }
}
