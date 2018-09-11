let echarts = require('echarts/lib/echarts')
require('zrender/lib/vml/vml')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/radar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
let chartList = []

let Main = {
  init : function () {
    this.cacheElement().staticFn($('.home-header'))
  },
  cacheElement : function () {
    let _this = this
    $.each(['.a1', '.a2'], function (i, item) {
      _this['$' + $.camelCase(item.replace(/\.|#/g, ''))] = $(item)
    })
    return _this
  },
  staticFn : function ($target) {
    let _this = this
    let h = $target.offset().top + 5
    $(window).scroll(function () {
      if ($(this).scrollTop() >= h) {
        $target.css({
          position   : 'fixed',
          top        : 0,
          background : 'rgba(72,79,97,1)'
        })
      } else {
        $target.css({
          position   : 'absolute',
          background : 'rgba(72,79,97,0)',
          top        : 'auto'
        })
      }
    })
    return _this
  }
}

$(function () {
  // Main.init()
})
/**
 * 创建操作系统图形表
 */
{
  let createPie = document.getElementById('pieEcharts')
  let createRadar = document.getElementById('radarEcharts')

  if (createPie) {
    let createPieChartIndex = []

    $.post('/os/getOSRateByYesterday', function (res) {
      if (res.code === 200 && res.data) {
        $(createPie).closest('.clearfix').find('.date').text(res.data[0].dayId)
        $.each(res.data, function (key, value) {
          createPieChartIndex.push({ value: (value.rate * 100).toFixed(2), name: value.os })
        })
        let createPieChart = echarts.init(createPie)
        chartList.push(createPieChart)
        createPieChart.setOption({
          color   : ['#41A5F5', '#66BB69', '#FF8965', '#FFB74D', '#A1887F', '#757575', '#BA68C8', '#E47373', '#5C6BC0', '#25A69A', '#9FCE55'],
          tooltip : {
            trigger   : 'item',
            formatter : '{a} {b}: {d}%'
          },
          series : [
            {
              name         : '',
              type         : 'pie',
              radius       : '45%',
              selectedMode : 'single',
              center       : ['50%', '50%'],
              itemStyle    : {
                emphasis : {
                  shadowBlur    : 10,
                  shadowOffsetX : 10,
                  shadowColor   : 'rgba(0, 0, 0, 0.5)'
                }
              },
              data : createPieChartIndex
            }
          ]
        })
      }
    })
  }

  if (createRadar) {
    let createRadarName = []
    let createRadarValue = []

    $.post('/engine/getRateByYesterday', function (res) {
      if (res.code === 200 && res.data) {
        $(createRadar).closest('.clearfix').find('.date').text(res.data.date)
        $.each(res.data.engines, function (key, value) {
          createRadarName.push({ name: value.name, max: 100 })
          createRadarValue.push((value.value * 100).toFixed(2))
        })
        let createRadarChart = echarts.init(createRadar)
        chartList.push(createRadarChart)
        createRadarChart.setOption({
          title   : { text: '' },
          tooltip : {},
          radar   : {
            indicator : createRadarName,
            center    : ['50%', '50%'],
            radius    : 100
          },
          series : [{
            name : '搜索引擎偏好',
            type : 'radar',
            data : [
              {
                value : createRadarValue,
                name  : '搜索引擎偏好'
              }
            ]
          }]
        })
      }
    })
  }
}
