var echarts = require('echarts/lib/echarts')
var Pagination = require('./common/pagination')
// 引入柱状图
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
require('./common/datepicker')

// 表格悬浮
// 表头fixed
function fixeTable(tableName) {
  // function Tablefix(tableName) {
  $('.main-nested').scroll(function() {
    var colsWidths = $(tableName)
      .find('tbody tr:first td')
      .map(function() {
        return $(this).width()
      })

    $(tableName)
      .find('thead tr:eq(1) th')
      .each(function(i, element) {
        $(this).width(colsWidths[i])
      })
    var headerHeight = $('.header-new-report').height()
    // if (($('body').scrollTop() + 50) > $(tableName).offset().top && ($('body').scrollTop() - $(tableName).offset().top - $(tableName).height() + 60) < 0) {
    $(tableName)
      .find('thead tr:eq(1)')
      .css('top', headerHeight + 'px')
    if ($(tableName).offset().top - headerHeight < 0 && $('body').scrollTop() - $(tableName).offset().top - $(tableName).height() + 60 < 0) {
      $(tableName)
        .find('thead tr')
        .eq(0)
        .addClass('fixed')
      $(tableName)
        .find('thead tr:eq(1) th')
        .css('white-space', 'normal')
    } else {
      $(tableName)
        .find('thead tr')
        .eq(0)
        .removeClass('fixed')
    }
  })
}
// 实例化
if ($('.c-table-fixed').length) {
  fixeTable('.c-table-fixed')
}

function toPercent(number, digit) {
  return typeof number === 'number' ? number.toFixed(digit || 2) + '%' : ''
}

let chartList = []
// 内容分析 - 搜索引擎
{
  let searchEnginesDiv = document.getElementById('chart-searchEngines')
  if (searchEnginesDiv) {
    let searchEnginesChart = echarts.init(searchEnginesDiv)
    let chartName = []
    let chartValue = []
    let color = ['#62A4F5', '#4DD0E1', '#8ACC78', '#F4BA60', '#9576CE', '#62A4F5', '#E47373', '#DCE675', '#FED54F', '#7F8084']
    chartList.push(searchEnginesChart)
    $.each(chartData.data.list, function(index, item) {
      if (item.value > 0) {
        chartName.push(item.name)
        chartValue.push({
          name  : item.name,
          value : item.value,
          rate  : toPercent(item.rate * 100)
        })
      }
      if (color[index]) {
        chartData.data.list[index].color = color[index]
      }
    })
    searchEnginesChart.setOption({
      color   : color,
      tooltip : {
        trigger   : 'item',
        formatter : '{a} <br/>{b}: {c} ({d}%)'
      },
      legend : {
        bottom : '0px',
        data   : chartName
      },
      series : [
        {
          name              : '搜索引擎',
          type              : 'pie',
          radius            : ['40%', '50%'],
          avoidLabelOverlap : false,
          data              : chartValue,
          label             : {
            normal : {
              show : false
            },
            emphasis : {
              show : true
            }
          },
          lableLine : {
            normal : {
              show : false
            },
            emphasis : {
              show : false
            }
          }
        }
      ]
    })
    let render = template.compile($('#tpl-searchEngines').html())
    let html = render(chartData.data)
    $('#table-searchEngines')
      .find('tbody')
      .html(html)
    chartList.push(searchEnginesChart)
  }
}
// 内容分析 - 蜘蛛记录
{
  let spiderDiv = document.getElementById('chart-spider')
  if (spiderDiv) {
    let spiderChart = echarts.init(spiderDiv)
    let chartName = []
    let chartValue = []
    let color = ['#62A4F5', '#4DD0E1', '#8ACC78', '#F4BA60', '#9576CE', '#62A4F5', '#E47373', '#DCE675', '#FED54F', '#7F8084']
    chartList.push(spiderChart)
    $.each(chartData.data, function(index, item) {
      if (item.value > 0) {
        chartName.push(item.name)
        chartValue.push({
          name  : item.name,
          value : item.value,
          rate  : toPercent(item.rate * 100)
        })
      }
      if (color[index]) {
        chartData.data[index].color = color[index]
      }
    })
    spiderChart.setOption({
      color   : color,
      tooltip : {
        trigger   : 'item',
        formatter : '{a} <br/>{b}: {c} ({d}%)'
      },
      legend : {
        bottom : '0px',
        data   : chartName
      },
      series : [
        {
          name              : '搜索引擎',
          type              : 'pie',
          radius            : ['40%', '50%'],
          avoidLabelOverlap : false,
          data              : chartValue,
          label             : {
            normal : {
              show : false
            },
            emphasis : {
              show : true
            }
          },
          lableLine : {
            normal : {
              show : false
            },
            emphasis : {
              show : false
            }
          }
        }
      ]
    })
    let render = template.compile($('#tpl-spider').html())
    let html = render(chartData)
    $('#table-spider')
      .find('tbody')
      .html(html)
    chartList.push(spiderChart)
  }
}
// 关键词
if ($('#table-keyword').length) {
  // 表头实例化
  let $tableKeyword = $('#table-keyword')
  // let $nodata = $tableKeyword.next('.none-data-box')
  let $formKeyword = $('#form-keyword')
  if ($('#pagination-context').length) {
    let pagination = new Pagination($formKeyword, {
      data : chartData.data,
      url  : window.location.href
    }).init($('#pagination-context'))
    $('#pagination-context').html(pagination)
  }
  $tableKeyword.on('click', '.c-table-btn-sort', function(event) {
    $('[name="sortType"]').val($(this).attr('data-sortType'))
    $('[name="order"]').val($(this).hasClass('desc') ? 1 : 0)
    $formKeyword.submit()
  })
}

// 历史来访量
{
  let contentHistory = document.getElementById('chart-content-history')
  if (contentHistory) {
    var contentHistoryChart = echarts.init(contentHistory)
    var contenthistory = []
    var lcontenthistoryIp = []
    chartList.push(contentHistoryChart)
    $.each(chartData.data, function(key, value) {
      contenthistory.push(value.dayId)
      lcontenthistoryIp.push(value.ip)
    })
    contentHistoryChart.setOption({
      color : ['#4AA6FC'],
      grid  : {
        containLabel : true,
        top          : 40,
        left         : 10,
        bottom       : 0,
        right        : 30
      },
      tooltip : {
        trigger : 'axis'
      },
      legend : {
        data  : ['IP', 'UV', '新UV', 'PV'],
        right : 20,
        top   : 10
      },
      xAxis : {
        type : 'category',
        data : contenthistory
      },
      yAxis : {
        type : 'value'
      },
      series : [
        {
          name   : 'IP',
          type   : 'line',
          smooth : true,
          data   : lcontenthistoryIp
        }
      ]
    })
  }
}
// 关键词历史来访量
{
  let keywordHistory = document.getElementById('chart-key-history')
  if (keywordHistory) {
    var keywordHistoryChart = echarts.init(keywordHistory)
    var keywordhistory = []
    var lkeywordhistoryIp = []
    chartList.push(keywordHistoryChart)
    $.each(chartData.data, function(key, value) {
      keywordhistory.push(value.date.split(' ')[0])
      lkeywordhistoryIp.push(value.ip)
    })

    keywordHistoryChart.setOption({
      color : ['#4AA6FC'],
      grid  : {
        containLabel : true,
        top          : 40,
        left         : 10,
        bottom       : 0,
        right        : 30
      },
      tooltip : {
        trigger : 'axis'
      },
      legend : {
        data  : ['IP', 'UV', '新UV', 'PV'],
        right : 20,
        top   : 10
      },
      xAxis : {
        type : 'category',
        data : keywordhistory
      },
      yAxis : {
        type : 'value'
      },
      series : [
        {
          name   : 'IP',
          type   : 'line',
          smooth : true,
          data   : lkeywordhistoryIp
        }
      ]
    })
  }
}

$(window).on('resize', function() {
  $.each(chartList, function(key, chart) {
    if (chart) {
      chart.resize()
    }
  })
})

// 内容分析 - 栏目/镜像
{
  $('body').on('click', '.btn-remove', function(event) {
    event.preventDefault()
    var $this = $(this)
    var data = $.parseJSON(
      $this
        .parent()
        .find('input')
        .val()
    )
    $.dialog({
      content  : '<div class="fb f20 c333 tc">确定要删除栏目“' + data.name + '”吗？</div><div class="tc mt5">(删除后将清空所有统计数据)</div>',
      type     : 'confirm',
      closeBtn : true,
      confirm  : function(deferred) {
        $.post($this.attr('data-url')).then(function(res) {
          if (res.code === 200) {
            $this.closest('tr').fadeOut(300, function() {
              $(this).remove()
            })
          } else {
            $this.data('lock', false)
            $.alert({
              text   : res.msg[0].value,
              status : 0
            })
          }
        })
        deferred.hideDialog()
      }
    })
  })

  function columnCU(type = 'column', data) {
    var _data = data || {
      title : '创建',
      url   : `/report/content/${type}/add`,
      comId : COMID
    }
    var layerColumnCU = $('#layer-column-CU').IUI('layer', {
      content     : template.compile($('#tpl-column-CU').html())(_data),
      offsetWidth : 800,
      dynamic     : true
    })
    layerColumnCU.showLayer()
    var validateColumnCU = $('#layer-column-CU').IUI('validate', {
      collections : [
        {
          required : 'name',
          context  : '.pr',
          matches  : {
            isNonEmpty : {
              errMsg : '名称不能为空'
            }
          }
        },
        {
          required : 'rule',
          context  : '.pr',
          matches  : {
            isNonEmpty : {
              errMsg : '分辨依据不能为空'
            }
          }
        }
      ]
    })
    $('.form-column-CU').IUI('ajaxForm', {
      before : function() {
        if (validateColumnCU.batch() === false) {
          return false
        }
      },
      success : function(res) {
        if (res.code === 200) {
          $.alert({
            text     : _data.title + '成功！',
            status   : 3,
            timeout  : 3000,
            callback : function() {
              window.location.href = ''
            }
          })
          layerColumnCU.hideLayer()
        } else {
          $.alert({
            text     : '提交失败！请稍后再试！',
            status   : 2,
            timeout  : 3000,
            callback : function() {
              window.location.href = ''
            }
          })
        }
      }
    })
  }
  $('.btn-createColumn').on('click', function(event) {
    columnCU()
  })

  $('.btn-createMirror').on('click', function(event) {
    columnCU('mirror')
  })

  $('body').on('click', '.btn-update', function(event) {
    event.preventDefault()
    var $this = $(this)
    var data = $.parseJSON(
      $this
        .parent()
        .find('input')
        .val()
    )
    columnCU(
      $(this).data('type'),
      $.extend(data, {
        title : '修改',
        url   : '/report/content/column/update',
        comId : COMID
      })
    )
  })
}

// 页面追踪列表

if ($('#heatmap-list').length && chartData.data) {
  let $form = $('#form-keyword')
  let pagination = new Pagination($form, {
    data : chartData.data,
    url  : window.location.href
  }).init($('#pagination-context'))
  var $tableKeyword = $('#table-keyword')
  $('#pagination-context').html(pagination)
  $tableKeyword.on('click', '.c-table-btn-sort', function(event) {
    $('[name="sortType"]').val($(this).attr('data-sortType'))
    $('[name="order"]').val($(this).hasClass('desc') ? 1 : 0)
    $form.submit()
  })
  $form.on('submit', function(event) {
    event.preventDefault()
    window.location.href = '/report/heatmap?' + $form.serialize()
  })
}

// 内容分析 - 页面浏览

if ($('#table-src').length) {
  let $tableKeyword = $('#table-src')
  // let $nodata = $tableKeyword.next('.none-data-box')
  let $formKeyword = $('#form-keyword')
  if ($('#pagination-context').length) {
    let pagination = new Pagination($formKeyword, {
      data : chartData.data,
      url  : window.location.href
    }).init($('#pagination-context'))
    $('#pagination-context').html(pagination)
  }
  $('#table-src').on('click', '.c-table-btn-sort', function(event) {
    $('[name="sortType"]').val($(this).attr('data-sortType'))
    $('[name="order"]').val($(this).hasClass('desc') ? 1 : 0)
    $('#form-keyword').submit()
  })
}

if ($('#table-url').length) {
  let $tableKeyword = $('#table-url')
  // let $nodata = $tableKeyword.next('.none-data-box')
  let $formKeyword = $('#form-keyword')
  if ($('#pagination-context').length) {
    let pagination = new Pagination($formKeyword, {
      data : chartData.data,
      url  : window.location.href
    }).init($('#pagination-context'))
    $('#pagination-context').html(pagination)
  }
  $('#table-url').on('click', '.c-table-btn-sort', function(event) {
    $('[name="sortType"]').val($(this).attr('data-sortType'))
    $('[name="order"]').val($(this).hasClass('desc') ? 1 : 0)
    $('#form-keyword').submit()
  })
}
