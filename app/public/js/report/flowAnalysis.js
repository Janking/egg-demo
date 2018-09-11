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

let chartList = []

function toFixed(number, digit) {
  return typeof (number) === 'number' ? number.toFixed(digit || 2) : ''
}


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

// 流量分析 - 51la 排名
{
  let siteRankingDiv = document.getElementById('chart-line-site-ranking')

  if (siteRankingDiv) {
    let siteRankingDivDate = []
    let siteRankingIp = []
    let siteRankingPv = []

    $.each(chartData.data.dayRank, function (index, value) {
      siteRankingDivDate.push(value.dayId)
      siteRankingIp.push(value.ipRank)
      siteRankingPv.push(value.pvRank)
    })

    let siteRankingChart = echarts.init(siteRankingDiv)
    chartList.push(siteRankingChart)
    // 绘制图表
    siteRankingChart.setOption({
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
        data: ['IP排名', 'PV排名'],
        right: 20,
        top: 10
      },
      xAxis: {
        type: 'category',
        data: siteRankingDivDate,
        axisLine: {
          onZero: false
        }

      },
      yAxis: {
        type: 'value',
        inverse: true
      },
      series: [{
        name: 'IP排名',
        type: 'line',
        smooth: true,
        data: siteRankingIp
      }, {
        name: 'PV排名',
        type: 'line',
        smooth: true,
        data: siteRankingPv
      }]
    })
  }
}

// 流量分析 - 时段分析
{
  let last24hourDiv = document.getElementById('chart-bar-last24hour')
  let lastQuarter24hourDiv = document.getElementById('chart-bar-lastQuarter24hour')

  // 表格
  if (last24hourDiv) {
    fixeTable('.c-table-hour-1')
    fixeTable('.c-table-hour-2')
  }

  if (last24hourDiv) {
    let last24hourChart = echarts.init(last24hourDiv)
    let last24hour = []
    let last24hourIp = []
    let last24hourUv = []
    let last24hourNewUv = []
    let last24hourPv = []
    chartList.push(last24hourChart)
    $.each(chartData.data.twentyFourHours || chartData.report, function (key, value) {
      last24hour.push(value.time)
      last24hourIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      last24hourUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      last24hourNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      last24hourPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })

    // last24hourChart.setOption({
    //   tooltip: {
    //     trigger: 'axis',
    //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
    //       type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    //     },
    //     formatter: function (event) {
    //       // if(event[0].axisValue === 'undefined'){
    //       //     return ''
    //       // }
    //       // return `${event[0].data.dayId}&nbsp&nbsp${event[0].name}时<br>
    //       //         IP：${event[0].value}&nbsp&nbsp${event[0].data.rate}<br>
    //       //         UV：${event[1].value}&nbsp&nbsp${event[1].data.rate}<br>
    //       //         新UV：${event[2].value}&nbsp&nbsp${event[2].data.rate}<br>
    //       //         PV：${event[3].value}&nbsp&nbsp${event[3].data.rate}`
    //       let nameMap = ['独立IP', '独立客户端', '新客户端', '浏览量']
    //       let str = ''

    //       $.each(event, function (key, item) {
    //         if (key === 0) {
    //           str += item.data.dayId + '<br>'
    //         }
    //         str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
    //       })
    //       return str
    //     }
    //   },
    //   color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
    //   legend: {
    //     data: ['IP', 'UV', '新UV', 'PV'],
    //     right: 20,
    //     top: 10
    //   },
    //   grid: {
    //     containLabel: true,
    //     top: 40,
    //     left: 0,
    //     bottom: 40,
    //     right: 20
    //   },
    //   xAxis: {
    //     type: 'category',
    //     boundaryGap: true,
    //     data: last24hour
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [{
    //     name: 'IP',
    //     type: 'bar',
    //     areaStyle: {
    //       normal: {}
    //     },
    //     data: last24hourIp
    //   }, {
    //     name: 'UV',
    //     type: 'bar',
    //     areaStyle: {
    //       normal: {}
    //     },
    //     data: last24hourUv
    //   }, {
    //     name: '新UV',
    //     type: 'bar',
    //     areaStyle: {
    //       normal: {}
    //     },
    //     data: last24hourNewUv
    //   }, {
    //     name: 'PV',
    //     type: 'bar',
    //     areaStyle: {
    //       normal: {}
    //     },
    //     data: last24hourPv
    //   }]
    // })
    last24hourChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
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
      xAxis: {
        type: 'category',
        data: last24hour
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        legendHoverLink: false,
        data: last24hourIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last24hourPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last24hourUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last24hourNewUv
      }]
    })
  }

  if (lastQuarter24hourDiv) {
    let lastQuarter24hourChart = echarts.init(lastQuarter24hourDiv)
    let quarter24hour = []
    let quarter24hourIp = []
    let quarter24hourUv = []
    let quarter24hourNewUv = []
    let quarter24hourPv = []

    chartList.push(lastQuarter24hourChart)
    $.each(chartData.data.threeMonths, function (key, value) {
      quarter24hour.push(value.time)
      quarter24hourIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%'
      })
      quarter24hourUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%'
      })
      quarter24hourNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%'
      })
      quarter24hourPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%'
      })
    })
    lastQuarter24hourChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
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
      xAxis: {
        type: 'category',
        data: quarter24hour
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: quarter24hourIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: quarter24hourPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: quarter24hourUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: quarter24hourNewUv
      }]
    })
  }
}
// 流量分析 - 日段分析
{
  let last31dayDiv = document.getElementById('chart-last31day')
  let avgDayOfMonthDivEl = document.getElementById('chart-avgDayOfMonth')

  if (last31dayDiv) {
    fixeTable('.c-table-day-1')
    fixeTable('.c-table-day-2')
  }

  if (last31dayDiv) {
    let last31dayDivChart = echarts.init(last31dayDiv)
    let last31day = []
    let last31dayIp = []
    let last31dayUv = []
    let last31dayNewUv = []
    let last31dayPv = []

    chartList.push(last31dayDivChart)

    $.each(chartData.data.lastThirtyOneDays, function (key, value) {
      last31day.push(value.dayId)
      last31dayIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      last31dayUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      last31dayNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      last31dayPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
    last31dayDivChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
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
      xAxis: {
        type: 'category',
        data: last31day,
        triggerEvent: true
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last31dayIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last31dayPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last31dayUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last31dayNewUv
      }]
    })
    last31dayDivChart.on('click', function (parms) {
      window.location.href = '/report/flow/his_detail?comId=' + comId + '&start=' + parms.value.split('(')[0] + ' 00:00:00&stop=' + parms.value.split('(')[0] + ' 23:59:59'
    })
  }

  if (avgDayOfMonthDivEl) {
    let avgDayOfMonthDivChart = echarts.init(avgDayOfMonthDivEl)
    let avgDayOfMonthDay = []
    let avgDayOfMonthDayIp = []
    let avgDayOfMonthDayUv = []
    let avgDayOfMonthDayNewUv = []
    let avgDayOfMonthDayPv = []

    chartList.push(avgDayOfMonthDivChart)

    $.each(chartData.data.allDays, function (key, value) {
      avgDayOfMonthDay.push(value.time)
      avgDayOfMonthDayIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      avgDayOfMonthDayUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      avgDayOfMonthDayNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      avgDayOfMonthDayPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
    avgDayOfMonthDivChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
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
      xAxis: {
        type: 'category',
        data: avgDayOfMonthDay
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfMonthDayIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfMonthDayPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfMonthDayUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfMonthDayNewUv
      }]
    })
  }
}

// 流量分析 - 周月分析
{
  let last24monthDiv = document.getElementById('chart-last24month')
  let last7div = document.getElementById('chart-last7day')
  let avgDayOfWeekEl = document.getElementById('chart-avgDayOfWeek')

  if (last24monthDiv) {
    fixeTable('.c-table-week-1')
  }

  if (last24monthDiv) {
    let last24monthDivChart = echarts.init(last24monthDiv)
    let last24month = []
    let last24monthIp = []
    let last24monthUv = []
    let last24monthNewUv = []
    let last24monthPv = []

    chartList.push(last24monthDivChart)

    $.each(chartData.data.lastTwentyFourMonths, function (key, value) {
      last24month.push(value.time)
      last24monthIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      last24monthUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      last24monthNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      last24monthPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
    last24monthDivChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
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
      xAxis: {
        type: 'category',
        data: last24month
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last24monthIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last24monthPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last24monthUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last24monthNewUv
      }]
    })
  }

  if (last7div) {
    let last7divChart = echarts.init(last7div)
    let last7day = []
    let last7dayIp = []
    let last7dayUv = []
    let last7dayNewUv = []
    let last7dayPv = []

    chartList.push(last7divChart)

    $.each(chartData.data.lastSevenDays, function (key, value) {
      last7day.push(value.time)
      last7dayIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      last7dayUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      last7dayNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      last7dayPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
    last7divChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
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
      xAxis: {
        type: 'category',
        data: last7day
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last7dayIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last7dayPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last7dayUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: last7dayNewUv
      }]
    })
  }

  if (avgDayOfWeekEl) {
    let avgDayOfWeekChart = echarts.init(avgDayOfWeekEl)
    let avgDayOfWeek = []
    let avgDayOfWeekIp = []
    let avgDayOfWeekUv = []
    let avgDayOfWeekNewUv = []
    let avgDayOfWeekPv = []

    chartList.push(avgDayOfWeekChart)

    $.each(chartData.data.allWeeks, function (key, value) {
      avgDayOfWeek.push(value.time)
      avgDayOfWeekIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      avgDayOfWeekUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      avgDayOfWeekNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      avgDayOfWeekPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
    avgDayOfWeekChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
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
      xAxis: {
        type: 'category',
        data: avgDayOfWeek
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfWeekIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfWeekPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfWeekUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: avgDayOfWeekNewUv
      }]
    })
  }
}

// 流量分析 - 近七日详情
{
  let last7dayDiv = document.getElementById('chart-bar-last7day')

  if ($('.c-table-history-1').length) {
    fixeTable('.c-table-history-1')
  }

  if ($('.c-table-history-2').length) {
    fixeTable('.c-table-history-2')
  }

  if (last7dayDiv) {
    let last7dayChart = echarts.init(last7dayDiv)
    let last7day = []
    let last7dayIp = []
    let last7dayPv = []
    let ipName, pvName

    chartList.push(last7dayChart)

    $.each(chartData.report['data'] || chartData.report, function (key, value) {
      ipName = `访问量 ${value.totalIp} IP`
      pvName = `浏览量 ${value.totalPv} PV`
      last7day.push(value.dimension)
      last7dayIp.push({
        name: ipName,
        value: value.ip,
        dimension: value.dimension,
        rate: toFixed(value.ipRate * 100, 2)
      })
      last7dayPv.push({
        name: pvName,
        value: value.pv,
        rate: toFixed(value.pvRate * 100, 2)
      })
    })

    last7dayChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          return `${event[0].data.dimension}<br>访问量：${event[0].value}&nbsp&nbsp${event[0].data.rate}<br>浏览量：${event[1].value}&nbsp&nbsp${event[1].data.rate}`
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: [ipName, pvName],
        right: 20,
        top: 10
      },
      dataZoom: [{
        show: true,
        realtime: true,
        height: 20,
        start: 10,
        end: 80,
        borderColor: '#999'
      }, {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }],
      grid: {
        containLabel: true,
        top: 40,
        left: 0,
        bottom: 40,
        right: 20
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: last7day
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: ipName,
        type: 'bar',
        data: last7dayIp
      }, {
        name: pvName,
        type: 'bar',
        data: last7dayPv
      }]
    })
  }
  let timeFrameDivEl = document.getElementById('chart-timeFrame')
  let dayFrameDivEl = document.getElementById('chart-dayFrame')
  if (timeFrameDivEl) {
    let timeFrameDivChart = echarts.init(timeFrameDivEl)
    let timeFrameDiv = []
    let timeFrameDivIp = []
    let timeFrameDivUv = []
    let timeFrameDivNewUv = []
    let timeFrameDivPv = []

    chartList.push(timeFrameDivChart)
    $.each(chartData.data.hourHistory, function (key, value) {
      timeFrameDiv.push(value.time)
      timeFrameDivIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId,
        time: value.time
      })
      timeFrameDivUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId,
        time: value.time
      })
      timeFrameDivNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId,
        time: value.time
      })
      timeFrameDivPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId,
        time: value.time
      })
    })

    timeFrameDivChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + ' ' + item.data.time + '时<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
      grid: {
        containLabel: true,
        top: 40,
        left: 20,
        bottom: 20,
        right: 40
      },
      // dataZoom: [{
      //   show: true,
      //   realtime: true,
      //   height: 20,
      //   start: 10,
      //   end: 80,
      //   borderColor: '#999'
      // }, {
      //   type: 'inside',
      //   realtime: true,
      //   start: 0,
      //   end: 100
      // }],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeFrameDiv
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: timeFrameDivIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: timeFrameDivPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: timeFrameDivUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: timeFrameDivNewUv
      }]
    })
  }

  if (dayFrameDivEl) {
    let dayFramedIVChart = echarts.init(dayFrameDivEl)
    let dayFramedIV = []
    let dayFramedIVIp = []
    let dayFramedIVUv = []
    let dayFramedIVNewUv = []
    let dayFramedIVPv = []

    chartList.push(dayFramedIVChart)

    $.each(chartData.data.dayHistory, function (key, value) {
      dayFramedIV.push(value.dayId)
      dayFramedIVIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      dayFramedIVUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      dayFramedIVNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      dayFramedIVPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })

    dayFramedIVChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'PV', 'VV', '新UV'],
        right: 20,
        top: 10,
        selected: {
          // 选中'系列1'
          'IP': true,
          'PV': true,
          'VV': false,
          '新UV': false
        }
      },
      grid: {
        containLabel: true,
        top: 40,
        left: 20,
        bottom: 20,
        right: 40
      },
      // dataZoom: [{
      //   show: true,
      //   realtime: true,
      //   height: 20,
      //   start: 10,
      //   end: 80,
      //   borderColor: '#999'
      // }, {
      //   type: 'inside',
      //   realtime: true,
      //   start: 0,
      //   end: 100
      // }],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dayFramedIV
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: dayFramedIVIp
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: dayFramedIVPv
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: dayFramedIVUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: dayFramedIVNewUv
      }]
    })
  }
}
// 流量分析 - 时段分析 - 历史
{
  let last24hourDiv = document.getElementById('chart-bar-last24hourHis')

  if (last24hourDiv) {
    let last24hourChart = echarts.init(last24hourDiv)
    let last24hour = []
    let last24hourIp = []
    let last24hourUv = []
    let last24hourNewUv = []
    let last24hourPv = []
    chartList.push(last24hourChart)
    $.each(chartData.data, function (key, value) {
      last24hour.push(value.time)
      last24hourIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      last24hourUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      last24hourNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      last24hourPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
    last24hourChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (event) {
          let nameMap = ['独立IP', '访问频次', '新客户端', '浏览量']
          let str = ''

          $.each(event, function (key, item) {
            if (key === 0) {
              str += item.data.dayId + '<br>'
            }
            str += nameMap[key] + ':' + item.value + '&nbsp&nbsp' + item.data.rate + '<br>'
          })
          return str
        }
      },
      color: ['#4AA6FC', '#F8797A', '#76CE6D', '#FFB74D'],
      legend: {
        data: ['IP', 'VV', '新UV', 'PV'],
        right: 20,
        top: 10
      },
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
      xAxis: {
        type: 'category',
        data: last24hour
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'IP',
        type: 'line',
        smooth: true,
        data: last24hourIp
      }, {
        name: 'VV',
        type: 'line',
        smooth: true,
        data: last24hourUv
      }, {
        name: '新UV',
        type: 'line',
        smooth: true,
        data: last24hourNewUv
      }, {
        name: 'PV',
        type: 'line',
        smooth: true,
        data: last24hourPv
      }]
    })
  }

  if ($('.flow-search').length) {
    var $form = $('.flow-search')
    $form.on('submit', function (event) {
      event.preventDefault()
      var $start = $form.serialize().split('&')[1]
      var $stop = $form.serialize().split('&')[2]
      var $comId = $form.serialize().split('&')[0]
      var $type = $('.flow-search').find('input[name="type"]:checked').val()
      var $showTable = $('.flow-search').find('input[name="showTable"]').prop('checked') ? '1' : '0'
      var $showBarChart = $('.flow-search').find('input[name="showBarChart"]').prop('checked') ? '1' : '0'
      var $device = $('.flow-search').find('input[name="isPc"]:checked').val()
      window.location.href = '/report/flow/his_detail?' + $comId + '&' + $start + '&' + $stop + '&type=' + ($type === '0' ? '' : 'day') + '&showTable=' + $showTable + '&showBarChart=' + $showBarChart + '&isPc=' + $device
    })
  }
}
// 流量分析-趋势分析
{
  let trendDiv = document.getElementById('chart-trend')
  if (trendDiv) {
    let trendChart = echarts.init(trendDiv)
    chartList.push(trendChart)
    // yesterday
    let todayIp = []
    let todayUv = []
    let todayNewUv = []
    let todayPv = []
    // today
    let yesterdayIp = []
    let yesterdayUv = []
    let yesterdayNewUv = []
    let yesterdayPv = []
    // x 轴
    let trendAxis = []
    // yesterday 遍历
    $.each(resultYesterday.data.hourHistory, function (key, value) {
      trendAxis.push(value.time)
      yesterdayIp.push({
        name: 'ip',
        value: value.ip,
        rate: toFixed(100 * value.ipRate) + '%',
        dayId: value.dayId
      })
      yesterdayUv.push({
        name: 'vv',
        value: value.frequency,
        rate: toFixed(100 * value.frequencyRate) + '%',
        dayId: value.dayId
      })
      yesterdayNewUv.push({
        name: 'newUv',
        value: value.newUv,
        rate: toFixed(100 * value.newUvRate) + '%',
        dayId: value.dayId
      })
      yesterdayPv.push({
        name: 'pv',
        value: value.pv,
        rate: toFixed(100 * value.pvRate) + '%',
        dayId: value.dayId
      })
    })
    // today
    if (resultToday.data.hourHistory) {
      $.each(resultToday.data.hourHistory, function (key, value) {
        todayIp.push({
          name: 'ip',
          value: value.ip,
          rate: toFixed(100 * value.ipRate) + '%',
          dayId: value.dayId
        })
        todayUv.push({
          name: 'vv',
          value: value.frequency,
          rate: toFixed(100 * value.frequencyRate) + '%',
          dayId: value.dayId
        })
        todayNewUv.push({
          name: 'newUv',
          value: value.newUv,
          rate: toFixed(100 * value.newUvRate) + '%',
          dayId: value.dayId
        })
        todayPv.push({
          name: 'pv',
          value: value.pv,
          rate: toFixed(100 * value.pvRate) + '%',
          dayId: value.dayId
        })
      })
    }
    trendChart.setOption({
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
      legend: {
        data: ['今日IP', '昨日IP'],
        right: 20,
        top: 10
      },
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
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: trendAxis
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: '今日IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: todayIp
      },
      {
        name: '昨日IP',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        data: yesterdayIp
      }
      ]
    })
    // 简单下拉
    $('.click-trend').on('click', function (event) {
      event.stopPropagation()
      $('.trend-dropdown-content').css('display', 'block')
    })

    $(document).on('click', function () {
      $('.trend-dropdown-content').css('display', 'none')
    })

    $('.trend-dropdown-content').find('li').on('click', function () {
      $('.trend-dropdown-content').find('li').removeClass('dropdown-check')
      $(this).addClass('dropdown-check')
      $('.trend-guide-content').html($(this).html())
      if ($(this).html() === '访问量 (IP)') {
        trendChart.setOption({
          legend: {
            data: ['今日IP', '昨日IP'],
            right: 20,
            top: 10
          },
          series: [{
            name: '今日IP',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: todayIp
          },
          {
            name: '昨日IP',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: yesterdayIp
          }
          ]
        })
      } else if ($(this).html() === '浏览量（PV)') {
        trendChart.setOption({
          legend: {
            data: ['今日PV', '昨日PV'],
            right: 20,
            top: 10
          },
          series: [{
            name: '今日PV',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: todayPv
          },
          {
            name: '昨日PV',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: yesterdayPv
          }
          ]
        })
      } else if ($(this).html() === '新客户端 (新UV)') {
        trendChart.setOption({
          legend: {
            data: ['今日新UV', '昨日新UV'],
            right: 20,
            top: 10
          },
          series: [{
            name: '今日新UV',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: todayNewUv
          },
          {
            name: '昨日新UV',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: yesterdayNewUv
          }
          ]
        })
      } else if ($(this).html() === '访问频次 (VV)') {
        trendChart.setOption({
          legend: {
            data: ['今日VV', '昨日VV'],
            right: 20,
            top: 10
          },
          series: [{
            name: '今日VV',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: todayUv
          },
          {
            name: '昨日VV',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            data: yesterdayUv
          }
          ]
        })
      }
    })

    // 点击出现选项
    $('.drow-list-title').on('click', function (event) {
      event.stopPropagation()
      $('.drow-list-inner').css('display', 'block')
    })

    $(document).on('click', function () {
      $('.drow-list-inner').css('display', 'none')
    })

    $('.drow-list-inner').on('click', function (e) {
      if (e.stopPropagation) { e.stopPropagation() } else { e.cancelBubble = true }
    })
    // 容器宽度
    let eleNum = 4
    let tableContainer = $('body').find('.table-container')
    // 表格宽度
    let tableWidth

    // 点击确认
    $('.drop-submit').on('click', function () {
      // 初始化偏移距离
      let scrollLeft = 0

      let checkBox = $('.c-checkbox-inline').find('input[type="checkbox"]')
      let tureLength = []
      let falseEle = []
      $.each(checkBox, function (key, index) {
        if (checkBox[key].checked) {
          tureLength.push(checkBox[key].checked)
        } else {
          falseEle.push(key)
        }
      })
      if (tureLength.length < 2) {
        $.alert({
          status: 2,
          text: '请选择两个以上的指标!'
        })
        return false
      } else {
        for (let i = 0; i < 5; i++) {
          $('body').find('.c-table-data-' + i).removeClass('hide')
        }
        $.each(falseEle, function (key, index) {
          $('body').find('.c-table-data-' + index).addClass('hide')
        })
        // 隐藏选单
        $('.drow-list-inner').css('display', 'none')
      }
      eleNum = 4 - falseEle.length
      tableResize()
    })

    // 表格自适应
    function tableResize() {
      // 初始化容器相对距离
      let scrollLeft = 0
      tableContainer.css('left', scrollLeft)

      tableWidth = ($('body').find('.table-content').width()) / 2
      tableContainer.css('width', tableWidth * eleNum)
      $('body').find('.c-table-data').css('width', tableWidth)

      // 左右滚动

      let iconPre = $('body').find('.trend-pre')
      let iconNext = $('body').find('.trend-next')
      iconPre.unbind('click')
      iconNext.unbind('click')

      if (scrollLeft === 0) {
        iconPre.css('cursor', 'not-allowed')
      }

      iconNext.on('click', function () {
        scrollLeft -= tableWidth
        if (scrollLeft + tableWidth * (eleNum - 1) <= 0) {
          scrollLeft = -(tableWidth * (eleNum - 2))
          iconNext.css('cursor', 'not-allowed')
          return false
        }
        $('body').find('.table-container').css('left', scrollLeft)
        iconPre.css('cursor', 'pointer')
      })

      iconPre.on('click', function (e) {
        iconNext.css('cursor', 'pointer')
        if (scrollLeft === 0) {
          iconPre.css('cursor', 'not-allowed')
          e.preventDefault()
          return false
        }
        scrollLeft += tableWidth
        $('body').find('.table-container').css('left', scrollLeft)
        iconPre.css('cursor', 'pointer')
      })
    }
    tableResize()
    $(window).on('resize', function () {
      tableResize()
    })
  }
}
$(window).on('resize', function () {
  $.each(chartList, function (key, chart) {
    if (chart) {
      chart.resize()
    }
  })
})
