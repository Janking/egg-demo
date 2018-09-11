{
  /**
   * 添加查询热力图
   */
  $('#form-searheatmap').IUI('ajaxForm', {
    before: function () {
      let readSear = $('#form-searheatmap').find('input[name="name"]').val()
      if (readSear === '') {
        $.alert({
          text: '请输入页面相关信息',
          timeout: 1000,
          callback: function () {
            return false
          }
        })
      }
    },
    success: function (res) {
      if (res.code === 200) {
        location.href = ''
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        })
      }
    }
  })
  /**
   * 添加热力图
   */
  function groupHotmap(data, target) {
    let _data = data || {
      title: '新建热力图',
      url: '',
      msg: '创建成功',
      comId: COMID
    }
    let creatHotmapLayer = $('#layer-createHotmap').IUI('layer', {
      content: template.compile($('#tpl-createHotmap').html())(_data),
      dynamic: true,
      offsetWidth: 800
    })

    creatHotmapLayer.showLayer()

    let createHotmapValidate = $('.form-creatHotmap').IUI('validate', {
      strategy: {
        httpReg: function () {
          let $target = this.self
          let value = $.trim($target[0].value)
          if (!/^((https|http)?:\/\/)[^\s]+/.test(value)) {
            return false
          }
        }
      },
      collections: [{
          required: 'heatmapName',
          context: '.col-20',
          matches: {
            isNonEmpty: {
              errMsg: '热力图名称不能为空'
            }
          }
        },
        {
          required: 'url',
          context: '.col-20',
          matches: {
            isNonEmpty: {
              errMsg: '网站地址不能为空'
            },
            httpReg: {
              errMsg: '请填写正确的网站地址'
            }
          }
        }
      ]
    })

    $('.form-creatHotmap').IUI('ajaxForm', {
      before: function () {
        if (createHotmapValidate.batch() === false) {
          return false
        }
      },
      success: function (res) {
        location.href = ''
      }
    })
  }

  // 移除分组
  $('body').on('click', '.remove', function (event) {
    let $this = $(this)
    let groupName = $this.closest('tr').find('.name').text()
    $.dialog({
      content: '<div class="fb f20 c333 tc">确定要删除热力图“' + groupName + '”吗？</div>',
      type: 'confirm',
      closeBtn: true,
      confirm: function (deferred) {
        $.post($this.attr('data-url')).then(function (res) {
          if (res.code === 200) {
            $this.closest('tr').fadeOut(300, function () {
              $(this).remove()
            })
          } else {
            $.alert({
              text: res.msg[0].value,
              status: 0
            })
          }
        })
        deferred.hideDialog()
      }
    })
  })

  // 更改状态
  $('body').on('click', '.status', function (event) {
    let $this = $(this)
    $.post($this.attr('data-url')).then(function (res) {
      if (res.code === 200) {
        location.href = ''
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        })
      }
    })
  })

  $('.btn-createHotmap').on('click', function (event) {
    groupHotmap()
  })
}
// 热力图页面
{
  // 实例化时间
  let heatmapStart = ''
  let heatmapStop = ''
  $('#datepicker-range').datepicker({
    dateFormat: 'yyyy-mm-dd',
    maxDate: new Date(),
    onSelect: function (date, datetime, datepicker) {
      heatmapStart = date.split(' - ')[0]
      heatmapStop = date.split(' - ')[1]
    },
    onHide: function (inst, animationCompleted) {
      location.href = '/report/heatmap/point?comId=' + COMID + '&start=' + heatmapStart + '&stop=' + heatmapStop + '&urlId=' + queryData.urlId
    }
  })

  // 创建发送数据对象
  $.sub('getSuccess', function (event, res) {
    window.frames[0].postMessage(JSON.stringify({type: $('.heatmap-mainer-nav a.active').attr('role'), data: res.data}), res.data.url)
  })

  // 发送数据实例化
  window.onload = function () {
    $.pub('getSuccess', resultData)
  }
}
