require('./common/datepicker')
let echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')

let chartList = []
$('.input-datepicker').datepicker()
// 表格悬浮
// 表头fixed
function fixeTable(tableName) {
  $('.main-nested').scroll(function () {
    var colsWidths = $(tableName).find('tbody tr:first td').map(function () {
      return $(this).width()
    })

    $(tableName).find('thead tr:eq(1) th').each(function (i, element) {
      $(this).width(colsWidths[i])
    })
    var headerHeight = $('.header-new-report').height()
    // if (($('body').scrollTop() + 50) > $(tableName).offset().top && ($('body').scrollTop() - $(tableName).offset().top - $(tableName).height() + 60) < 0) {
    $(tableName).find('thead tr:eq(1)').css('top', headerHeight + 'px')
    if (($(tableName).offset().top - headerHeight < 0) && ($('body').scrollTop() - $(tableName).offset().top - $(tableName).height() + 60) < 0) {
      $(tableName).find('thead tr').eq(0).addClass('fixed')
      $(tableName).find('thead tr:eq(1) th').css('white-space', 'normal')
    } else {
      $(tableName).find('thead tr').eq(0).removeClass('fixed')
    }
  })
}
// 表头实例化
if ($('.c-table-attraction').length) {
  fixeTable('.c-table-attraction')
}
// 阅读深度列表
{
  $('#form-read-depth').IUI('ajaxForm', {
    before: function () {
      let readSear = $('#form-read-depth').find('input[name="name"]').val()
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
        // location.href = ''
      }
    }
  })

  function ReadthList(data, target) {
    let _data = data || {
      title: '新建阅读深度列表',
      url: '/user/siteGroup/add',
      msg: '创建成功',
      comId: COMID
    }
    let creatReadLayer = $('#layer-createRead').IUI('layer', {
      content: template.compile($('#tpl-creatRead').html())(_data),
      dynamic: true,
      offsetWidth: 800
    })

    creatReadLayer.showLayer()

    let createAddRead = $('.form-creatReadDepth').IUI('validate', {
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
        required: 'name',
        context: '.col-20',
        matches: {
          isNonEmpty: {
            errMsg: '名称不能为空'
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

    $('.form-creatReadDepth').IUI('ajaxForm', {
      before: function () {
        if (createAddRead.batch() === false) {
          return false
        }
      },
      success: function (res) {
        if (res.code == 200) {
          location.href = ''
        } else if (res.code == 500) {
          $.alert({
            text: '服务器错误',
            status: 0
          })
        } else {
          $.alert({
            text: res.msg[0].value,
            status: 0
          })
        }
      }
    })
  }

  // 移除分组
  $('body').on('click', '.remove', function (event) {
    let $this = $(this)
    let groupName = $this.closest('tr').find('.name').text()
    $.dialog({
      content: '<div class="fb f20 c333 tc">确定要删除深度列表“' + groupName + '”吗？</div>',
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

  $('.btn-createReadDepath').on('click', function (event) {
    ReadthList()
  })
}
// 阅读深度详情页
{
  // 时间实例化
  let start = ''
  let stop = ''
  $('#datepicker-readDepth').datepicker({
    dateFormat: 'yyyy-mm-dd',
    maxDate: new Date(),
    onSelect: function (date, datetime, datepicker) {
      start = date.split(' - ')[0]
      stop = date.split(' - ')[1]
    },
    onHide: function (inst, animationCompleted) {
      location.href = '/report/attraction/read_depth/detail?comId=' + COMID + '&start=' + start + '&stop=' + stop + '&url=' + queryData.url + '&isPc=' + queryData.isPc
    }
  })

  // 柱状图
  let chartReadDepth = document.getElementById('chart-readDepth')
  if (chartReadDepth) {
    let contentReadDepthChart = echarts.init(chartReadDepth)
    let contentXAxis = []
    let readDepthIp = []
    let readDepthUv = []
    let readDepthPv = []

    chartList.push(contentReadDepthChart)

    $.each(chartData.data, function (key, value) {
      contentXAxis.push('第' + value.readDepth + '屏')
      readDepthIp.push({
        name: 'ip',
        value: value.ip
      })
      readDepthUv.push({
        name: 'uv',
        value: value.uv
      })
      readDepthPv.push({
        name: 'pv',
        value: value.pv
      })
    })

    contentReadDepthChart.setOption({
      color: ['#4AA6FC', '#F8797A', '#76CE6D'],
      grid: {
        containLabel: true,
        top: 40,
        left: 10,
        bottom: 0,
        right: 30
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['IP', 'UV', '新UV', 'PV'],
        right: 20,
        top: 10
      },
      xAxis: {
        type: 'category',
        data: contentXAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        data: readDepthIp
      }, {
        name: 'UV',
        type: 'line',
        smooth: true,
        data: readDepthUv
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        data: readDepthPv
      }]
    })
  }
}
