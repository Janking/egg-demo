var $thresholdInput = $('#JThreshold input[name="threshold"]')
var $thresholdSelect = $('#JThreshold select')
var $noticeType = $('[name="noticeType"]')
$('[name="comparator"]').change(function() {
  var $this = $(this)
  if ($this.val() === 'up' || $this.val() === 'down') {
    $thresholdInput.val($thresholdSelect.val())
    hasWarnData && $thresholdInput.next().val(warnData.threshold)
    $('#JThreshold').addClass('show-select')
  } else {
    $thresholdInput.val('')
    $('#JThreshold').removeClass('show-select')
  }
})
$thresholdSelect.change(function() {
  $thresholdInput.val($thresholdSelect.val())
})
$noticeType.change(function() {
  var type = this.value
  $('.show-type').hide()
  $('.show-type[data-type="' + type + '"]').show()
})
var createWarnValidate = $('.form-warn').IUI('validate', {
  strategy : {
    maxThresholdValue : function() {
      if (this.self[0].value > 100000000 || this.self[0].value < 1) {
        return false
      }
    }
  },
  collections : [
    {
      required : 'name',
      context  : '.col-4',
      matches  : {
        isNonEmpty : {
          errMsg : '提醒名称不能为空'
        },
        strictLength : {
          errMsg : '提醒名称长度超过16字符，1汉字=2个字符',
          max    : 16
        }
      }
    },
    {
      required : 'threshold',
      context  : '.col-4',
      matches  : {
        isNonEmpty : {
          errMsg : '阈值不能为空'
        },
        onlyInt : {
          errMsg : '请输入整数'
        },
        maxThresholdValue : {
          errMsg : '请输入正确范围的整数'
        }
      }
    },
    {
      required : 'noticeType',
      context  : '.col-8',
      matches  : {
        isChecked : {
          errMsg : '请选择通知类型'
        }
      }
    }
  ]
})

$('.form-warn').IUI('ajaxForm', {
  before : function() {
    if (createWarnValidate.batch() === false) {
      return false
    }
  },
  success : function(res) {
    if (res.code === 200) {
      $.alert({
        text     : (hasWarnData ? '更新' : '创建') + '成功',
        status   : 3,
        timeout  : 3000,
        callback : function() {
          window.location.href = '/report/manage/energy?comId=' + COMID
        }
      })
    } else {
      $.alert({
        text    : (hasWarnData ? '更新' : '创建') + '失败，' + res.msg[0].value,
        status  : 2,
        timeout : 3000
      })
    }
  }
})
// function groupWarn(data, target) {
//   let _data = data || {
//     title : '添加提醒',
//     url   : '/report/notice/add',
//     msg   : '创建成功',
//     comId : COMID
//   }
//   let createWarn = $('#layer-createwarn').IUI('layer', {
//     content     : template.compile($('#tpl-createWarn').html())(_data),
//     dynamic     : true,
//     offsetWidth : 800
//   })

//   createWarn.showLayer()

// }

// 修改分组
// $('body').on('click', '.update', function() {
//   let $this = $(this)
//   let dataId = $this
//     .closest('tr')
//     .find('input[name="dataId"]')
//     .val()
//   $('body')
//     .find('input[name="name"]')
//     .val($this.data('name'))
//   groupWarn(
//     $.extend({
//       title : '修改能量提醒',
//       url   : '/report/notice/update',
//       msg   : '修改成功！',
//       comId : COMID,
//       id    : dataId
//     })
//   )
// })

// 清除数据页面
if ($('.btn-init').length) {
  // 弹层
  $('body').on('click', '.btn-init', function() {
    let creatformat = $('#layer-creatformat').IUI('layer', {
      content     : template.compile($('#tpl-format').html())(),
      dynamic     : true,
      offsetWidth : 800
    })
    creatformat.showLayer()
  })

  // aj初始化
  $(document).on('click', '.btn-format', function() {
    $.post('/site/clear', { comId: comid }, function(res) {
      if (res.code === 200) {
        $.alert({
          status   : 3,
          text     : res.data,
          callback : function() {
            window.location.href = window.location.href
          }
        })
      } else {
        $.alert({
          status : 2,
          text   : '清除失败，请稍后重试'
        })
      }
    })
  })
}
