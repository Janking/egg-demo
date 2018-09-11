let WebUploader = require('../vendor/webuploader/dist/webuploader')

module.exports = function () {
  /**
 * return Top
 */
  // 弹层
  var mobileCodeLayer = $('#layer-mobile-code').IUI('layer', {
    // offsetWidth : 500,
    dynamic: false,
    cancelCall: function () {
      // window.location.href = window.location.href
    }
  })
  // 点击banner
  $('.feadback-header').click(function () {
    // $('.feedback').click()
    // 显示弹层
    mobileCodeLayer.showLayer()
  })
  $('.btn-close-feedback').on('click', function () {
    mobileCodeLayer.hideLayer()
  })
  // feedback
  $('.feedback-header-close').click(function () {
    $.cookie.set('feedback_close', '1')
    $('.sidebar').removeAttr('style')
    $('.container').removeAttr('style')
    $('.feadback-content').hide()
  })

  var $mainNest = $('body').find('.main-nested')

  if ($mainNest.length) {
    $('.main-nested').scroll(function () {
      if ($(this).scrollTop() > 500) {
        $backTop.css('visibility', 'visible')
      } else {
        $backTop.css('visibility', 'hidden')
      }
    })
  }

  var $backTop = $('.back-top')
  $backTop.on('click', function () {
    $('body,html').animate({ scrollTop: 0 }, 500)
    if ($mainNest.length) {
      $('.main-nested').animate({ scrollTop: 0 }, 500)
    }
    return false
  })

  $(window).scroll(function () {
    if ($(this).scrollTop() > 500) {
      $backTop.css('visibility', 'visible')
    } else {
      $backTop.css('visibility', 'hidden')
    }
  })

  var $feedbackClick = $('body').find('.feedback')
  var $feedbackClose = $('body').find('.feedback-close')
  var $feedbackContent = $('body').find('.feedback-content')
  var isLogin = $('body').find('#feedback-userLogin').val()
  // 关闭
  $feedbackClose.on('click', function () {
    $feedbackContent.addClass('hide')
  })

  // 点击打开
  $feedbackClick.on('click', function () {
    if (isLogin === '0') {
      $.cookie.set('51la_feedback', '1')
      window.location.href = '/login'
    } else {
      $feedbackContent.removeClass('hide')
    }
  })

  // 点击打开二维码
  $('body').find('.qr-code').hover(function () {
    $('body').find('.qr-code-content').css('display', 'block')
  }, function () {
    $('body').find('.qr-code-content').css('display', 'none')
  })

  // 实例化文件上传插件
  var imgDate = []
  var uploader = WebUploader.create({
    // 选完文件后，是否自动上传。
    auto: false,
    // swf文件路径
    swf: '/js/vendor/webuploader/Uploader.swf',
    // 文件接收服务端。
    server: '//up-z2.qiniup.com/adimg',

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#filePicker',
    formData: {
      token: $('#filePicker').data('token'),
      key: +new Date()
    },
    // 只允许选择图片文件。
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    },
    // 限制张数
    fileNumLimit: 3,
    fileSingleSizeLimit: 2 * 1024 * 1024
  })

  // 当有文件添加进来的时候
  uploader.on('fileQueued', function (file) {
    var $li = $(
      '<div id="' + file.id + '" class="file-item thumbnail">' +
      '<div class="info">' + file.name + '</div>' +
      '<i class="remove-img iconfont icon-fa-times-circle-o"></i></div>'
    )

    // $list为容器jQuery实例

    $('.uploader-list').append($li)
  })
  // 上传成功函数
  function uploadComplete(file, res) {
    imgDate.push('https://images.51.la/' + res.key)
    $('input[name="images"]').val(imgDate)
  }

  $('#fileList').on('click', '.remove-img', function () {
    uploader.removeFile($(this).parent().attr('id'))
    $(this).parent().remove()
  })

  // 限制三张
  $('#filePicker').click(function () {
    if (uploader.getFiles().length >= 3) {
      $.alert({
        text: '最大上传数量为三张',
        status: 2
      })
      return false
    }
  })

  // 上传表单
  if ($('.form-feedback').length) {
    var createFeedbackValidate = $('.form-feedback').IUI('validate', {
      collections: [{
        required: 'type',
        context: '.form-group',
        matches: {
          isChecked: {
            errMsg: '请选择反馈与什么相关！'
          }
        }
      },
      {
        required: 'content',
        context: '.form-group',
        matches: {
          isNonEmpty: {
            errMsg: '请输入问题描述'
          }
        }
      }]
    })

    $('.form-feedback').IUI('ajaxForm', {
      before: function (event, config) {
        if (createFeedbackValidate.batch() === false) {
          return false
        }
      },
      success: function (res) {
        if (res.code === 200) {
          $('.form-callback').val('')
          $feedbackContent.addClass('hide')
          $.alert({
            text: '提交成功！感谢您的反馈！',
            status: 3,
            timeout: 2000
          })
        } else {
          $.alert({
            text: res.msg[0].value,
            status: 1,
            timeout: 3000
          })
        }
      },
      error: function () {
        $.alert({
          text: '数据提交失败，请稍候再试',
          status: 0
        })
      }
    })

    $('.btn-feedback').on('click', function (event) {
      var deferred = $.Deferred()
      if (uploader.getFiles().length === 0 || uploader.getFiles().length === uploader.getStats().successNum) {
        $('.form-feedback').trigger('submit')
      } else {
        $.when((function () {
          uploader.upload()
          uploader.on('uploadSuccess', function (file, res) {
            if (parseInt(file.size) <= parseInt(uploader.options.chunkSize)) {
              uploadComplete(file, res)
            } else {
              $.alert({
                text: '图片暂未上传，请稍后再试！',
                status: 2,
                timeout: 2000
              })
            }
            if (uploader.getStats().progressNum === 0) {
              deferred.resolve()
            }
          })

          return deferred
        })()).then(function () {
          $('.form-feedback').trigger('submit')
        })
      }
    })
  }
}
