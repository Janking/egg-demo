let echarts = require('echarts/lib/echarts')
let Pagination = require('../report/common/pagination')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
let COLOR_ARR = ['#41A5F5', '#66BB69', '#FF8965', '#FFB74D', '#A1887F', '#757575', '#BA68C8', '#E47373', '#5C6BC0', '#25A69A', '#9FCE55']
if ($('.form-ranking').length) {
  var pagination = new Pagination($('.form-ranking'), {
    data: chartData.data.data,
    url: window.location.href
  }).init($('#pagination-context'))
  $('#pagination-context').html(pagination)
}
if ($('table').length) {
  $('table').find('tr').eq(0).find('th').each(function (index, el) {
    $('table').find('thead tr').eq(1).find('th').eq(index).css({
      'width': el.offsetWidth
    })
  })

  $(window).on('scroll', function (event) {
    if ($('body').scrollTop() >= $('.table-1').offset().top) {
      $('.table-1').find('thead tr').eq(0).addClass('fixed')
    } else {
      $('.table-1').find('thead tr').eq(0).removeClass('fixed')
    }
  })
}
// 操作系统
if ($('#chart-pie-os').length) {
  let createRadar = document.getElementById('chart-pie-os')
  let createPieChartIndex = []
  let createPieChart = echarts.init(createRadar)

  $.each(pieData.data, function (key, value) {
    createPieChartIndex.push({
      value: value.rate,
      name: value.os,
      children: value.children
    })
  })

  createPieChart.setOption({
    color: COLOR_ARR,
    title: {
      text: '操作系统占比 ',
      textStyle: {
        fontSize: 14,
        color: '#333'
      },
      left: 15,
      top: 10
    },
    selectedMode: 'single',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ({d}%)'
    },
    series: [{
      name: '',
      type: 'pie',
      radius: '45%',
      center: ['50%', '50%'],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: createPieChartIndex
    }]
  })
  createPieChart.on('click', function (event) {
    drawLine(event.data.children, event.color, event.data.name)
  })
  drawLine(pieData.data[0].children, '#41A5F5', pieData.data[0].os)
}

function drawLine(data, color, title) {
  let dom = document.getElementById('chart-line-os')
  let chart = echarts.init(dom)
  chart.setOption({
    title: {
      text: `TOP10: ${title}`,
      textStyle: {
        fontSize: 14,
        color: '#333'
      },
      left: 15,
      top: 10
    },
    color: [color],
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: data.map(function (item, index) {
        return item.name.replace(/\\x20/g, ' ').replace(/\\x2e/g, '.')
      }),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    }],
    yAxis: [{
      type: 'value',
      max: 100
    }],
    series: [{
      name: '直接访问',
      type: 'bar',
      barWidth: '40%',
      data: data.map(function (item, index) {
        return (item.value * 100).toFixed(2)
      })
    }]
  })
}
// 搜索引擎
{
  let rateArray = []

  if ($('#chart-pie-searchEngine').length) {
    let obj = chartData.data.proportion
    $.each(obj, function (key, item) {
      rateArray.push({
        value: item.value,
        name: item.name
      })
    })

    let option = {
      color: COLOR_ARR,
      title: {
        text: '搜索引擎占比 ',
        textStyle: {
          fontSize: 14,
          color: '#333'
        },
        left: 15,
        top: 10
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{b} : {d}%'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: obj.map(function (item, index) {
          return item.name
        }),
        show: false
      },
      series: [{
        show: true,
        name: '访问来源',
        type: 'pie',
        radius: '40%',
        center: ['50%', '50%'],
        data: rateArray,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          normal: {
            label: {
              show: true,
              formatter: '{b} {d}%'
            }
          }
        }
      }]
    }
    let searchEngineChart = echarts.init($('#chart-pie-searchEngine')[0])
    searchEngineChart.setOption(option)
    let myChart = echarts.init($('#chart-line-searchEngine')[0])
    let lineData = []
    let mapping = [{
      name: '百度',
      value: 'baiduRate'
    }, {
      name: '必应',
      value: 'bingRate'
    }, {
      name: '谷歌',
      value: 'googleRate'
    }, {
      name: '神马',
      value: 'smRate'
    }, {
      name: '好搜',
      value: 'soRate'
    }, {
      name: '搜狗',
      value: 'sogouRate'
    }, {
      name: '搜搜',
      value: 'sosoRate'
    }, {
      name: '雅虎',
      value: 'yahooRate'
    }, {
      name: '有道',
      value: 'youdaoRate'
    }]
    $.each(mapping, function (index, item) {
      let temp = []
      $.each(chartData.data.table, function (index2, item2) {
        temp.push(item2[item.value].toFixed(2))
      })
      lineData.push({
        name: item.name,
        type: 'line',
        areaStyle: {
          normal: {}
        },
        data: temp.reverse(),
        smooth: true,
        stack: '总占比'
      })
    })

    myChart.setOption({
      color: COLOR_ARR,
      legend: {
        top: 45,
        data: mapping.map(function (item) {
          return item.name
        })
      },
      title: {
        text: '搜索引擎偏好',
        textStyle: {
          fontSize: 14,
          color: '#333'
        },
        left: 15,
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function (data) {
          let str = ''
          $.each(data, function (i, item) {
            str += `${item.seriesName} : ${item.value} %</br>`
          })
          return str
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        top: 80,
        left: '2%',
        right: '2%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: [{
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        },
        type: 'category',
        boundaryGap: false,
        data: chartData.data.table.reverse().map(function (item) {
          return item.dayId.replace(/\\x2d/g, '/')
        })
      }],
      yAxis: [{
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#EDEDED'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      }],
      series: lineData
    })
  }
}
// 浏览器排名
{
  if ($('#chart-pie-browser').length) {
    let createRadar = document.getElementById('chart-pie-browser')
    let createPieChartIndex = []
    let createPieChart = echarts.init(createRadar)

    $.each(pieDataBrowser.data, function (key, value) {
      createPieChartIndex.push({
        value: value.rate,
        name: value.browserName,
        children: value.children
      })
    })

    createPieChart.setOption({
      title: {
        text: '浏览器占比 ',
        textStyle: {
          fontSize: 14,
          color: '#333'
        },
        left: 15,
        top: 10
      },
      color: COLOR_ARR,
      selectedMode: 'single',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ({d}%)'
      },
      series: [{
        name: '',
        type: 'pie',
        radius: '45%',
        center: ['50%', '50%'],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: createPieChartIndex
      }]
    })
    createPieChart.on('click', function (event) {
      if (event.data.name === '其他') {
        return false
      } else {
        drawLineBrowser(event.data.children, event.color, event.data.name)
      }
    })
    if (pieDataBrowser.code === 200) {
      drawLineBrowser(pieDataBrowser.data[0].children, '#41A5F5', pieDataBrowser.data[0].browserName)
    }
  }

  function drawLineBrowser(data, color, title) {
    let dom = document.getElementById('chart-line-browser')
    let chart = echarts.init(dom)
    chart.setOption({
      title: {
        text: `TOP10: ${title}`,
        textStyle: {
          fontSize: 14,
          color: '#333'
        },
        left: 15,
        top: 10
      },
      color: [color],
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: data.map(function (item, index) {
          return item.browserName.replace(/\\x20/g, ' ').replace(/\\x2e/g, '.')
        }),
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      }],
      yAxis: [{
        type: 'value',
        max: 100
      }],
      series: [{
        name: '直接访问',
        type: 'bar',
        barWidth: '40%',
        data: data.map(function (item, index) {
          return (item.rate).toFixed(2)
        })
      }]
    })
  }

  if ($('#chart-brokenLine-browsers').length) {
    let myChartBrowser = echarts.init($('#chart-brokenLine-browsers')[0])
    let lineData = []
    var obj = {}
    var dateList = []
    var legendName = []
    $.each(pileData.data.table, function (index, item) {
      dateList.push(item.dayId.replace(/\\x2d/g, '/'))
      $.each(item.children, function (index2, item2) {
        if (obj[item2.name] === undefined) {
          obj[item2.name] = {}
          obj[item2.name].name = item2.name
          obj[item2.name].data = []
        }
        obj[item2.name].data.push(item2.ip)
      })
    })

    $.each(obj, function (index, item) {
      legendName.push(item.name)
      lineData.push({
        name: item.name,
        type: 'line',
        areaStyle: {
          normal: {}
        },
        data: item.data,
        smooth: true
      })
    })

    myChartBrowser.setOption({
      color: COLOR_ARR,
      legend: {
        top: 50,
        data: legendName
      },
      title: {
        text: '浏览器偏好',
        textStyle: {
          fontSize: 14,
          color: '#333'
        },
        left: 15,
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function (data) {
          let str = ''
          $.each(data, function (i, item) {
            str += `${item.seriesName} : ${item.value} </br>`
          })
          return str
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        top: 80,
        left: '2%',
        right: '4%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: [{
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        },
        type: 'category',
        boundaryGap: false,
        data: dateList
      }],
      yAxis: [{
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#EDEDED'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      }],
      series: lineData
    })
  }
}
