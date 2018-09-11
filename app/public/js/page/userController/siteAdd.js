module.exports = function () {
  /**
   * 添加统计id
   */
  if ($('.form-siteAdd').length) {
    var myValidate = $('.form-siteAdd').IUI('validate', {
      strategy : {
        numChart : function (params) {
          var $target = this.self
          var value = $target[0].value
          if (!/^[a-zA-Z0-9\u4e00-\u9fa5]{4,16}/.test($.trim(value))) {
            return false
          }
        },
        httpReg : function () {
          var $target = this.self
          var value = $.trim($target[0].value)
          if (!/^((https|http)?:\/\/)[^\s]+/.test(value)) {
            return false
          }
        }
      },
      collections : [{
        required : 'name',
        context  : '.col-4',
        matches  : {
          isNonEmpty : {
            errMsg : '网站名不能为空'
          },
          between : {
            errMsg : '网站名称长度须在4-100字符以内',
            range  : [4, 100]
          }
          // ,
          // numChart : {
          //   errMsg : '可使用数字、英文字母和中文，4-16个字符'
          // }
        }
      },
      {
        required : 'url',
        context  : '.col-4',
        matches  : {
          isNonEmpty : {
            errMsg : '网站地址不能为空'
          },
          httpReg : {
            errMsg : '请填写正确的网站地址'
          }
        }
      }
      ]
    })

    $('.form-siteAdd').IUI('ajaxForm', {
      before : function (event, config) {
        if (myValidate.batch() === false) {
          return false
        }
        $.loading(true, 'css')
      },
      success : function (res) {
        $.loading(false, 'css')
        if (res.code === 200) {
          window.location.href = '/user/site/site_result?comId=' + res.data.comId
        } else {
          $.alert({
            text    : res.msg[0].value,
            status  : 2,
            timeout : 3000
          })
        }
      },
      error : function () {
        $.alert({
          text   : '数据提交失败，请稍候再试',
          status : 0
        })
      }
    })
  }
}
