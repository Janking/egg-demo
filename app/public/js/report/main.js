let echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
require('./common/datepicker')

// 趋势图设定
let chartList = []
let trendDiv = document.getElementById('chart-trend')
let trendChart = null
let chartOptions = {}

if (trendDiv) {
  trendChart = echarts.init(trendDiv)
  chartList.push(trendChart)
}

let errorHTMLMsg =
  '<p class="loading-tips">抱歉，数据获取出现错误，请尝试刷新页面~</p>'
let start = TIME.today
let stop = start
let trendParams = {
  comId: COMID,
  start: start,
  stop: stop,
  trendType: -1,
  _csrf: $('[name="_csrf"]').val()
}
let commonParams = {
  comId: COMID,
  start: start,
  stop: stop,
  pageSize: 10,
  pageNum: 1,
  sortType: 1,
  _csrf: $('[name="_csrf"]').val()
}
let showMainDatas = function (target) {
  let $Jtrend = $('#Jtrend')
  let $Jkeyword = $('#Jkeyword')
  let $Jreferer = $('#Jreferer')
  let $Jprovince = $('#Jprovince')
  $('.loading-wrapper .loading-layer').addClass('loading-layer-show')
  if (arguments.length) {
    start = $(target).data('range').start
    stop = $(target).data('range').stop
    // 趋势图参数特殊化
    let trendType = $(target).data('trend-type') // 此类型值表示对比区段差值, 比如对比前一天为 -1, 周对比则是 -7
    trendParams.trendType = trendType
    trendParams.start = start
    trendParams.stop = stop
    commonParams.start = start
    commonParams.stop = stop
    $Jtrend
      .find('.Jmore')
      .attr(
        'href',
        '/report/flow/his_detail?comId=' +
        COMID +
        '&start=' +
        start +
        ' 00:00:00' +
        '&stop=' +
        stop +
        ' 23:59:59'
      )
    $Jkeyword
      .find('.Jmore')
      .attr(
        'href',
        '/report/content/keyword?comId=' +
        COMID +
        '&start=' +
        start +
        '&stop=' +
        stop
      )
    $Jreferer
      .find('.Jmore')
      .attr(
        'href',
        '/report/content/src?comId=' +
        COMID +
        '&start=' +
        start +
        '&stop=' +
        stop
      )
    $Jprovince
      .find('.Jmore')
      .attr(
        'href',
        '/report/client/province?comId=' +
        COMID +
        '&start=' +
        start +
        '&stop=' +
        stop
      )
  }

  $.post('/report/main/trend', trendParams, function (res) {
    let html = ''
    $Jtrend.find('.loading-layer-show').html('<i class="loading-img"></i>')
    if (res.code === 200) {
      if (res.data === null) {
        html = `
        <div class="none-data-box active">
          <span>对比数据不足，请到详情页查看更多数据~</span>
        </div>
        `
        $Jtrend.find('.box-content').html(html)
      } else {
        var trendData = res.data.trendData
        var comparedTrendData = res.data.comparedTrendData
        // 图形渲染
        drawTrendChart(trendData, comparedTrendData)
      }
      $Jtrend.find('.loading-layer-show').removeClass('loading-layer-show')
    } else {
      $Jtrend.find('.loading-layer').html(errorHTMLMsg)
    }
  })

  $.post('/report/main/topKeyword', commonParams, function (res) {
    let html = ''
    if (res.code === 200) {
      if (res.data === null) {
        html = `
        <div class="none-data-box active">
          <span>暂无数据</span>
        </div>
        `
      } else {
        var data = res.data.list
        for (var i = 0; i < data.length; i++) {
          html +=
            '<div class="row" >' +
            '<div class="col-a">' +
            '<p>' +
            data[i].keyword.slice(0, 40) +
            '</p>' +
            '</div>' +
            '<div class="col-b">' +
            '<p>' +
            data[i].ip +
            '</p>' +
            '</div>' +
            '<div class="col-c">' +
            '<p>' +
            (data[i].rate * 100).toFixed(2) +
            '%</p>' +
            '</div>' +
            '</div>'
        }
      }
    } else {
      html = errorHTMLMsg
    }
    $Jkeyword.find('.ranklist__body').html(html)
    $Jkeyword.find('.loading-layer-show').removeClass('loading-layer-show')
  })

  $.post('/report/main/topReferer', commonParams, function (res) {
    let html = ''
    if (res.code === 200) {
      if (res.data === null) {
        html = `
        <div class="none-data-box active">
          <span>暂无数据</span>
        </div>
        `
      } else {
        var data = res.data.list
        for (var i = 0; i < data.length; i++) {
          html +=
            '<div class="row" >' +
            '<div class="col-a">' +
            '<p>' +
            data[i].src.slice(0, 40) +
            '</p>' +
            '</div>' +
            '<div class="col-b">' +
            '<p>' +
            data[i].ip +
            '</p>' +
            '</div>' +
            '<div class="col-c">' +
            '<p>' +
            (data[i].rate * 100).toFixed(2) +
            '%</p>' +
            '</div>' +
            '</div>'
        }
      }
    } else {
      html = errorHTMLMsg
    }
    $Jreferer.find('.ranklist__body').html(html)
    $Jreferer.find('.loading-layer-show').removeClass('loading-layer-show')
  })

  $.post('/report/main/topProvince', commonParams, function (res) {
    let html = ''
    if (res.code === 200) {
      if (res.data === null) {
        html = `
        <div class="none-data-box active">
          <span>暂无数据</span>
        </div>
        `
      } else {
        $('.trend-dropdown').show()
        var data = res.data.list
        for (var i = 0; i < data.length; i++) {
          html +=
            '<div class="row" >' +
            '<div class="col-a">' +
            '<p>' +
            data[i].name.slice(0, 40) +
            '</p>' +
            '</div>' +
            '<div class="col-b">' +
            '<p>' +
            data[i].ip +
            '</p>' +
            '</div>' +
            '<div class="col-c">' +
            '<p>' +
            (data[i].ipRate * 100).toFixed(2) +
            '%</p>' +
            '</div>' +
            '</div>'
        }
      }
    } else {
      html = errorHTMLMsg
    }
    $Jprovince.find('.ranklist__body').html(html)
    $Jprovince.find('.loading-layer-show').removeClass('loading-layer-show')
  })
}

$('#JdataSelector .btn').click(function () {
  var $this = $(this)
  if ($this.hasClass('btn-primary')) return
  $this
    .siblings()
    .removeClass('btn-primary')
    .addClass('btn-default')
  $this.addClass('btn-primary').removeClass('btn-default')
  showMainDatas(this)
})

showMainDatas()

// 趋势图开始部分
function toFixed(number, digit) {
  return typeof number === 'number' ? number.toFixed(digit || 2) : ''
}

// 流量分析-趋势分析
function drawTrendChart(trendData, comparedTrendData) {
  let selectedLineType = $('.trend-guide-content').html()
  // now
  let nowIp = []
  let nowUv = []
  let nowNewUv = []
  let nowPv = []
  // before
  let beforeIp = []
  let beforeUv = []
  let beforeNewUv = []
  let beforePv = []
  // x 轴
  let trendAxis = []

  // before
  if (comparedTrendData.hourHistory) {
    $.each(comparedTrendData.hourHistory, function (key, value) {
      beforeIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      beforeUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      beforeNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      beforePv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
  }
  // now
  if (trendData.hourHistory) {
    $.each(trendData.hourHistory, function (key, value) {
      trendAxis.push(`${(value.dayId).slice(5).replace('-', '/')} ${value.time}时`)
      nowIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      nowUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      nowNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      nowPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
  }
  selectedOption(selectedLineType)
  chartOptions = $.extend({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    color: ['#4AA6FC', 'rgba(98,164,245,0.5)'],
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      containLabel: true,
      top: 40,
      left: 10,
      bottom: 0,
      right: 30
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: trendAxis
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ]
  }, chartOptions)
  trendChart.setOption(chartOptions)
  // 简单下拉
  $('.trend-dropdown').on('click', function (event) {
    event.stopPropagation()
    $('.trend-dropdown-content').css('display', 'block')
  })

  $(document).on('click', function () {
    $('.trend-dropdown-content').css('display', 'none')
  })

  $('.trend-dropdown-content')
    .find('li')
    .on('click', function () {
      $('.trend-dropdown-content')
        .find('li')
        .removeClass('dropdown-check')
      $(this).addClass('dropdown-check')
      $('.trend-guide-content').html($(this).html())
      setTimeout(function () {
        $('.trend-dropdown-content').css('display', 'none')
      }, 10)
      selectedOption($(this).html())
      trendChart.setOption(chartOptions)
    })

  function selectedOption(selectedLineType) {
    let trendType = $('#JdataSelector .btn-primary').data('trend-type')
    let legendData = []
    if (selectedLineType === '访问量 (IP)') {
      if (trendType === -1) {
        legendData = [nowIp[0].dayId + ' IP', beforeIp[0].dayId + ' IP']
      } else {
        // 目前只有两种情况, 业务拓展概率较低, 故暂时写死
        legendData = ['近七天IP', '上七天IP']
      }
      chartOptions = {
        legend: {
          data: legendData,
          right: 20,
          top: 10
        },
        series: [
          {
            name: legendData[0],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: nowIp
          },
          {
            name: legendData[1],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: beforeIp
          }
        ]
      }
    } else if (selectedLineType === '浏览量 (PV)') {
      if (trendType === -1) {
        legendData = [nowPv[0].dayId + ' PV', beforePv[0].dayId + ' PV']
      } else {
        // 目前只有两种情况, 业务拓展概率较低, 故暂时写死
        legendData = ['近七天PV', '上七天PV']
      }
      chartOptions = {
        legend: {
          data: legendData,
          right: 20,
          top: 10
        },
        series: [
          {
            name: legendData[0],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: nowPv
          },
          {
            name: legendData[1],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: beforePv
          }
        ]
      }
    } else if (selectedLineType === '新客户端 (新UV)') {
      if (trendType === -1) {
        legendData = [nowNewUv[0].dayId + ' 新UV', beforeNewUv[0].dayId + ' 新UV']
      } else {
        // 目前只有两种情况, 业务拓展概率较低, 故暂时写死
        legendData = ['近七天新UV', '上七天新UV']
      }
      chartOptions = {
        legend: {
          data: legendData,
          right: 20,
          top: 10
        },
        series: [
          {
            name: legendData[0],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: nowNewUv
          },
          {
            name: legendData[1],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: beforeNewUv
          }
        ]
      }
    } else if (selectedLineType === '访问频次 (VV)') {
      if (trendType === -1) {
        legendData = [nowUv[0].dayId + ' VV', beforeUv[0].dayId + ' VV']
      } else {
        // 目前只有两种情况, 业务拓展概率较低, 故暂时写死
        legendData = ['近七天VV', '上七天VV']
      }
      chartOptions = {
        legend: {
          data: legendData,
          right: 20,
          top: 10
        },
        series: [
          {
            name: legendData[0],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: nowUv
          },
          {
            name: legendData[1],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: beforeUv
          }
        ]
      }
    }
  }
}
$(window).on('resize', function () {
  $.each(chartList, function (key, chart) {
    if (chart) {
      chart.resize()
    }
  })
})
