let echarts = require('echarts')
require('echarts/extension/bmap/bmap')
require('echarts/map/js/china.js')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/component/markPoint')
var inject = require('../vendor/iui/inject')
inject(require('../vendor/iui/common/tabs'), true)
require('../../sass2/datashow.scss')
var $body = $('body')

function formatNum(value) {
  var value = (value || 0).toString(), result = ''
  while (value.length > 3) {
    result = ',' + value.slice(-3) + result
    value = value.slice(0, value.length - 3)
  }
  if (value) { result = value + result }
  return result
}

// 时间
function getDate() {
  var today = new Date()
  var date = today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日 '
  var week = ' 星期' + '日一二三四五六 '.charAt(today.getDay())
  var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  $('.nowTime').html(date + '/' + week)
}
getDate()

// 设置获取的变量
var dataMapAll, MIN, dataMapInc = ''

// 地图
var dom = document.getElementById('map')
var myChart = echarts.init(dom)
var app = {}
// 获取地图数据
var endUrl = 'http://192.168.0.142:7777'
// 获取地图数据函数
// 配置
let option = {
  tooltip : {
    trigger   : 'item',
    formatter : function (event) {
      return '排名：第' + (parseInt(event.dataIndex) + 1) + '<br>' + event.data.name + '：' + formatNum(event.data.value[2])
    },
    backgroundColor : 'rgba(3, 123, 217, 0.2)',
    borderWidth     : 2,
    borderColor     : 'rgba(46,225,225,0.6)'
  },
  // bmap : {
  //   center   : [104.114129, 37.550339],
  //   zoom     : 5,
  //   roam     : true,
  //   mapStyle : {
  //     styleJson : []
  //   }
  // },
  geo : {
    map   : 'china',
    zoom  : 1.2,
    label : {
      emphasis : {
        show : false
      }
    },
    roam      : false,
    itemStyle : {
      normal : {
        areaColor   : 'rgba(3,156,248,0.2)',
        borderColor : 'rgba(3,222,248,.3)'
      },
      emphasis : {
        areaColor : 'rgba(3,156,248,0.2)'
      }
    }
  },
  series : [
    {
      name                    : '城市',
      type                    : 'scatter',
      coordinateSystem        : 'geo',
      data                    : dataMapAll,
      animationEasing         : 'bounceInOut',
      animationDurationUpdate : function (idx) {
        return idx * 5
      },
      symbolSize : function (val, data) {
        if (val[2] < MIN) {
          return parseInt(Math.random() * 6)
        } else if (data.dataIndex < 10) {
          return 28 - (data.dataIndex * 2)
        } else {
          return parseInt(val[2] / MIN) > 30 ? 30 : parseInt(val[2] / MIN)
        }
      },
      label : {
        normal : {
          formatter : '{b}',
          position  : 'right',
          show      : false
        },
        emphasis : {
          show : true
        }
      },
      itemStyle : {
        normal : {
          // color : function (data) {
          //   let opacity = 0
          //   if (data.dataIndex < 100) {
          //     opacity = 1
          //   } else if (data.dataIndex < 200) {
          //     opacity = 0.8
          //   } else if (data.dataIndex < 300) {
          //     opacity = 0.6
          //   } else if (data.dataIndex < 500) {
          //     opacity = 0.4
          //   }
          //   return 'rgba(3,225,224,' + opacity + ')'
          // },
          color       : 'rgb(3,225,224)',
          shadowColor : 'rgb(3,225,224)',
          shadowBlur  : 50
        }
      }
    }
    // {
    //   name             : 'Top 5',
    //   type             : 'effectScatter',
    //   coordinateSystem : 'geo',
    //   data             : dataOne.slice(0, 10),
    //   symbolSize       : function (val) {
    //     return val[2] / 10
    //   },
    //   showEffectOn : 'render',
    //   rippleEffect : {
    //     brushType : 'stroke'
    //   },
    //   hoverAnimation : true,
    //   label          : {
    //     normal : {
    //       formatter : '',
    //       position  : 'right',
    //       show      : true
    //     }
    //   },
    //   itemStyle : {
    //     normal : {
    //       color       : '#03E1E0',
    //       shadowBlur  : 5,
    //       shadowColor : 'rgba(3,225,224,0.33)'
    //     }
    //   },
    //   zlevel : 1
    // }
    // {
    //   name             : 'Top 5',
    //   type             : 'effectScatter',
    //   coordinateSystem : 'bmap',
    //   data             : convertData(data.sort(function (a, b) {
    //     return b.value - a.value
    //   }).slice(0, 6)),
    //   symbolSize : function (val) {
    //     return val[2] / 10
    //   },
    //   showEffectOn : 'render',
    //   rippleEffect : {
    //     brushType : 'stroke'
    //   },
    //   hoverAnimation : true,
    //   label          : {
    //     normal : {
    //       formatter : '{b}',
    //       position  : 'right',
    //       show      : true
    //     }
    //   },
    //   itemStyle : {
    //     normal : {
    //       color       : 'purple',
    //       shadowBlur  : 10,
    //       shadowColor : '#333'
    //     }
    //   },
    //   zlevel : 1
    // }
  ]
}
let startFreshMap = +new Date()
function getMapDate() {
  $.post('/map', function (res) {
    if (res.code == 200) {
      dataMapAll = res.data.all
      dataMapInc = res.data.increment
      MIN = dataMapAll[parseInt(dataMapAll.length * 0.2)].value[2]
      drawMap()

      setInterval(function () {
        if (+new Date() - startFreshMap > 5000) {
          startFreshMap = +new Date()
          refreshMap()
        }
      }, 1000)
    }
  })
}
getMapDate()

function drawMap() {
  // console.log(dataMapAll)
  option.series[0].data = dataMapAll
  myChart.setOption(option, true)
  var app = {}

  app.currentIndex = -1
  setInterval(function () {
    var dataLen = option.series[0].data.length
    // 取消之前高亮的图形
    myChart.dispatchAction({
      type        : 'downplay',
      seriesIndex : 0,
      dataIndex   : app.currentIndex
    })
    if (app.currentIndex >= 9) {
      app.currentIndex = -1
    } else {
      app.currentIndex = (app.currentIndex + 1) % dataLen
    }
    // 高亮当前图形
    myChart.dispatchAction({
      type        : 'highlight',
      seriesIndex : 0,
      dataIndex   : app.currentIndex
    })
    // 显示 tooltip
    myChart.dispatchAction({
      type        : 'showTip',
      seriesIndex : 0,
      dataIndex   : app.currentIndex
    })
  }, 5000)
}

function refreshMap() {
  $.post('/map', function (res) {
    if (res.code == 200) {
      // dataMapInc = res.data.increment
      // $.each(dataMapInc, function (item, value) {
      //   $.each(dataMapAll, function (item2, value2) {
      //     if (value.name === value2.name) {
      //       value2.value[2] += value.value[2]
      //     }
      //   })
      // })
      // option.series[0].data = dataMapAll
      // myChart.setOption(option, true)
      dataMapAll = res.data.all
      option.series[0].data = dataMapAll
      myChart.setOption(option, true)
    }
  })
}

// 饼图
var pie = document.getElementById('pie-chart')
var pieChart = echarts.init(pie)
let pieOption = {
  backgroundColor : 'rgba(3, 123, 217, 0.20)',
  tooltip         : {
    trigger   : 'item',
    formatter : '{a} <br/>{b}: {c} ({d}%)'
  },
  color  : ['#ECD055', '#007BBE'],
  series : [
    {
      name   : '访问来源',
      type   : 'pie',
      radius : ['50%', '70%'],
      // avoidLabelOverlap : false,
      label  : {
        normal : {
          show      : true,
          position  : 'outside',
          formatter : '{d}%',
          color     : '#fff',
          fontSize  : 28
        }
      },
      labelLine : {
        normal : {
          show : false
        }
      },
      data : [
        { value: pieData.data[0].pv, name: '移动端' },
        { value: pieData.data[1].pv, name: 'PC端' }
      ]
    }
  ]
}
pieChart.setOption(pieOption, true)

// d3 bubble chart
var width = 450,
  height = 188

var nodes = [
    {
      radius : 17,
      name   : '音乐'
    },
    {
      radius : 23,
      name   : '影视'
    },
    {
      radius : 25,
      name   : '游戏'
    },
    {
      radius : 30,
      name   : '小说'
    },
    {
      radius : 19,
      name   : '网购'
    },
    {
      radius : 21,
      name   : '体育'
    },
    {
      radius : 23,
      name   : '医疗'
    },
    {
      radius : 22,
      name   : '资源'
    },
    {
      radius : 20,
      name   : '物流'
    },
    {
      radius : 20,
      name   : '法律'
    },
    {
      radius : 20,
      name   : '财经'
    },
    {
      radius : 22,
      name   : '招聘'
    },
    {
      radius : 23,
      name   : '饮食'
    },
    {
      radius : 26,
      name   : '地方'
    },
    {
      radius : 24,
      name   : '汽车'
    }
  ],
  scale = d3.scale.linear(),
  color = d3.scale.category20()

var force = d3.layout.force()
  .theta(0.5)
  .gravity(0.03)
  .charge(function (d, i) {
    return -80
  })
  .nodes(nodes)
  .size([width, height])

force.start()
var svg = d3.select('#bubble-chart').append('svg')
  .attr('width', width)
  .attr('height', height)

var g = svg.selectAll('g')
  .data(nodes)
  .enter()
  .append('g')
  .append('circle')
  .attr('r', function (d) {
    return d.radius
  })
  .style('fill', function (d, i) {
    return '#265785'
  })

svg.selectAll('g').append('text').attr('text-anchor', 'middle').attr('font-size', 12).attr('alignment-baseline', 'middle').attr('fill', '#fff').text(function (d) {
  return d.name
})

force.on('tick', function (e) {
  var q = d3.geom.quadtree(nodes),
    i = 0,
    n = nodes.length

  while (++i < n) q.visit(collide(nodes[i]))

  svg.selectAll('text').attr('x', (d) => d.x).attr('y', d => d.y)
  svg.selectAll('circle')
    .attr('cx', function (d) {
      return d.x
    })
    .attr('cy', function (d) {
      return d.y
    })
})

function collide(node) {
  var r = node.radius + 16,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r
  return function (quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
        y = node.y - quad.point.y,
        l = Math.sqrt(x * x + y * y),
        r = node.radius + quad.point.radius
      if (l < r) {
        l = (l - r) / l * 0.5
        node.x -= x *= l
        node.y -= y *= l
        quad.point.x += x
        quad.point.y += y
      }
      if (node.y < node.radius) {
        node.y = node.radius
      }
      if (node.x < node.radius) {
        node.x = node.radius
      }

      if (node.y > height - node.radius) {
        node.y = height - node.radius
      }
      if (node.x > width - node.radius) {
        node.x = width - node.radius
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
  }
}

// 堆叠折线图
var line = document.getElementById('line-chart')
var lineChart = echarts.init(line)
let lineOption
var xDate = [],
  ipData = [],
  pvData = [],
  uvData = []

function drawLineAct(params) {
  $.post('/tendency', function (res) {
    $.each(res.data, function (index, item) {
      xDate.push(item.hour)
      ipData.push(item.ip)
      pvData.push(item.pv)
      uvData.push(item.uv)
    })
    drawLine()
    lineChart.setOption(lineOption, true)
    xDate = []
    ipData = []
    pvData = []
    uvData = []
  })
}
drawLineAct()
setInterval(function () {
  drawLineAct()
}, 3600000)

function drawLine() {
  lineOption = {
    backgroundColor : 'rgba(3, 123, 217, 0.20)',
    color           : ['#007BBE', '#F2CF35'],
    textStyle       : {
      color : '#0A98AD'
    },
    tooltip : {
      trigger   : 'axis',
      formatter : function (event) {
        return '当前统计：<br>' + event[0].seriesName + '：' + formatNum(event[0].value)
      }
    },
    grid : {
      left         : '1%',
      right        : '2%',
      bottom       : '2%',
      containLabel : true
    },
    xAxis : {
      type        : 'category',
      boundaryGap : false,
      axisLine    : {
        show      : true,
        lineStyle : {
          color : '#22677B'
        }
      },
      data : xDate
    },
    yAxis : {
      type     : 'value',
      axisLine : {
        show      : true,
        lineStyle : {
          color : '#22677B'
        }
      },
      splitLine : {
        show      : true,
        lineStyle : {
          color : '#22677B',
          type  : 'dashed'
        }
      }
    },
    series : [
      {
        name       : 'uv',
        type       : 'line',
        stack      : '总量',
        data       : uvData,
        smooth     : true,
        symbolSize : 8,
        // markPoint : {
        //   data : [
        //     { type: 'max', name: '最大值' },
        //     { type: 'min', name: '最小值' }
        //   ],
        //   symbol : 'roundRect'
        // },
        itemStyle  : {
          normal : {
            lineStyle : {
              color : '#00EDD1 ',
              width : '2'
            }
          }
        },
        areaStyle : {
          normal : {
            color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset : 0,
              color  : 'rgba(3,222,248,.5)'
            }, {
              offset : 1,
              color  : 'rgba(3,222,248,0)'
            }])
          }
        }
      }
      // {
      //   name      : 'pv',
      //   type      : 'line',
      //   stack     : '总量',
      //   data      : pvData,
      //   markPoint : {
      //     data : [
      //       { type: 'max', name: '最大值' },
      //       { type: 'min', name: '最小值' }
      //     ],
      //     symbol : 'roundRect'
      //   },
      //   itemStyle : {
      //     normal : {
      //       lineStyle : {
      //         color : '#00EDD1',
      //         width : '3'
      //       }
      //     }
      //   }
      // }
    ]
  }
}
// 站点数据统计
var numOptions = {
  useEasing : true,
  easingFn  : function (t, b, c, d) {
    var ts = (t /= d) * t
    var tc = ts * t
    return b + c * (tc + -3 * ts + 3 * t)
  },
  useGrouping : true,
  separator   : ',',
  decimal     : '.'
}
var newtotal = 0
var oldTotal = 0
var newtotalSite = 0
var oldTotalSite = 0
var isFirst = true
var isFirstSite = true
var totalPv
var totalSite
var startTime = +new Date()
var startTimeSite = +new Date()
var countTimer = null
var countTimerSite = null

function polling(params) {
  if (isFirst) {
    fetchCount()
    // fetchCountSite()
  } else if (+new Date() - startTime > 3000) {
    startTime = +new Date()
    clearInterval(countTimer)
    fetchCount()
    // fetchCountSite()
  } else {
    return false
  }
}

function pollingSite(params) {
  if (isFirstSite) {
    fetchCountSite()
  } else if (+new Date() - startTimeSite > 600000) {
    startTime = +new Date()
    clearInterval(countTimerSite)
    fetchCountSite()
  } else {
    return false
  }
}

function fetchCount() {
  $.post('/totalPv', function (res) {
    oldTotal = newtotal
    newtotal = res.data
    if (isFirst) {
      totalPv = new CountUp('total-pv', 0, newtotal, 0, 1, numOptions)
      if (!totalPv.error) {
        totalPv.start()
      } else {
        console.error(totalPv.error)
      }
    } else {
      totalPv.update(newtotal)
    }

    isFirst = false
    countTimer = setInterval(polling, 1000)
  })
}

function fetchCountSite() {
  $.post('/totalSite', function (res) {
    oldTotalSite = newtotalSite
    newtotalSite = res.data
    if (isFirstSite) {
      totalSite = new CountUp('total-site', 0, newtotalSite, 0, 1, numOptions)
      if (!totalSite.error) {
        totalSite.start()
      } else {
        console.error(totalSite.error)
      }
    } else {
      totalSite.update(newtotalSite)
    }

    isFirstSite = false
    countTimerSite = setInterval(pollingSite, 60000)
  })
}
fetchCountSite()
polling()

// 省份城市
var areaBar = document.getElementById('area-chart')
var areaChart = echarts.init(areaBar)
var areaOption

var xDataProvince = [], provinceData = []
var provinceShadow = []
var provinceYmax = 50
$.post('/province', function (res) {
  if (res.code === 200) {
    $.each(res.data, function (index, item) {
      xDataProvince.push(item.name.replace(/[省市]/g, ''))
      provinceData.push(item.pvRate * 100)
    })
    provinceYmax = Math.max.apply(null, provinceData)
    for (var i = 0; i < provinceData.length; i++) {
      provinceShadow.push(provinceYmax)
    }
    drawBar(xDataProvince, provinceData, provinceShadow)
  } else {
    console.log('省份请求出错！！')
  }
})
// 城市
var xDatacity = [], cityData = []
var cityShadow = []
var cityYmax = 50

$.post('/city', function (res) {
  if (res.code === 200) {
    $.each(res.data, function (index, item) {
      xDatacity.push(item.name.replace('市', ''))
      cityData.push(item.pvRate * 100)
    })
    cityYmax = Math.max.apply(null, cityData)
    for (var i = 0; i < cityData.length; i++) {
      cityShadow.push(cityYmax)
    }
  } else {
    console.log('省份请求出错！！')
  }
})

// 点击重新加载
// 点击城市
$body.on('click', '#city-data', function () {
  $(this).addClass('active')
  $('#province-data').removeClass('active')
  drawBar(xDatacity, cityData, cityShadow)
})

$body.on('click', '#province-data', function () {
  $(this).addClass('active')
  $('#city-data').removeClass('active')
  drawBar(xDataProvince, provinceData, provinceShadow)
})
setInterval(function () {
  $('.tabs-header').find('li.active').siblings().click()
}, 10000)

function drawBar(xAxisData, seriesData, ShadowData) {
  areaOption = {
    backgroundColor : 'rgba(3, 123, 217, 0.20)',
    textStyle       : {
      color : '#0A98AD'
    },
    grid : {
      left         : '1%',
      right        : '4%',
      bottom       : '10%',
      containLabel : true,
      height       : 170
    },
    xAxis : {
      type     : 'category',
      axisLine : {
        show      : true,
        lineStyle : {
          color : '#22677B'
        }
      },
      axisLabel : {
        show      : true,
        inside    : false,
        interval  : 0,
        textStyle : {
          color : 'gba(3,123,217,0.30)'
        }
      },
      data : xAxisData
    },
    yAxis : {
      type     : 'value',
      axisLine : {
        show      : true,
        lineStyle : {
          color : '#22677B'
        }
      },
      axisLabel : {
        formatter : '{value} %'
      },
      splitLine : {
        show      : false,
        lineStyle : {
          color : '#22677B',
          type  : 'dashed'
        }
      }
    },
    series : [
      { // For shadow
        type      : 'bar',
        itemStyle : {
          normal : { color: '#000' }
        },
        barWidth  : 15,
        itemStyle : {
          normal : {
            barBorderRadius : 5,
            color           : 'rgba(3,123,217,0.30)'
          }
        },
        barGap         : '-100%',
        barCategoryGap : '40%',
        data           : ShadowData,
        animation      : false
      },
      {
        data      : seriesData,
        type      : 'bar',
        barWidth  : 15,
        itemStyle : {
          normal : {
            color : new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#03D0CA ' },
                { offset: 1, color: '#1066B1' }
              ]
            ),
            barBorderRadius : 5
          },
          emphasis : {
            color : new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ]
            )
          }
        }
      }]
  }
  areaChart.setOption(areaOption, true)
}

// 底部滚动实例化
$('#news-obj').powerSlider({
  handle : 'slideTo'
})// 请对照相应的对象写相应的动作。
// $('.btn-heatmap-item').on('click', function (params) {
//   PopupCenter($(this).data('url'), 'xtf', '640', '1080')
// })

// var newWindow

// function PopupCenter(url, title, w, h) {
//   // Fixes dual-screen position                         Most browsers      Firefox
//   var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left
//   var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top

//   var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
//   var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

//   var left = ((width / 2) - (w / 2)) + dualScreenLeft
//   var top = ((height / 2) - (h / 2)) + dualScreenTop
//   newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

//   // Puts focus on the newWindow
//   newWindow.focus()
// }

// ic活动页数据
var appendList = []

function updateIc() {
  $.post('/ic', function (res) {
    let str = ''
    $.each(res.data, function (index, item) {
      str += `<li><a class="btn-heatmap-item" href="javascript:;" data-name="${item.name}" data-url="/ic_heatmap?comId=${item.comId}&url=${item.url}">${item.name}</a> <span class="pull-right">${formatNum(item.pv)}</span></li>`
    })
    if (res.code === 200) {
      $('.boxs-3-2').find('.data-content ul').html(str)
    } else {
      console.log('请求ic数据出错')
    }
  })
}
updateIc()
setInterval(function name(params) {
  updateIc()
}, 20000)

// 空格键控制弹层轮播
var theScroll = false
var scrollTime
// 实例化点击弹层
$body.on('click', '.btn-heatmap-item', function () {
  layer.open({
    type       : 2,
    title      : $(this).data('name'),
    maxmin     : true,
    shadeClose : true, // 点击遮罩关闭层
    area       : ['414px', '900px'],
    content    : $(this).data('url'),
    cancel     : function () {
      clearInterval(scrollTime)
    }
  })
})
$(document).on('keydown', function (event) {
  // 初始化
  layer.closeAll()
  var i = 0
  if (event.keyCode === 32) {
    // 控制开关
    if (theScroll === false) {
      theScroll = true
    } else {
      theScroll = false
    }
    // 轮播弹层
    if (theScroll) {
      $body.find('.btn-heatmap-item:eq(' + i + ')').click()
      scrollTime = setInterval(function () {
        layer.closeAll()
        if (i === 9) {
          i = 0
        } else {
          i++
        }
        $body.find('.btn-heatmap-item:eq(' + i + ')').click()
      }, 30000)
    } else {
      // 清除定时器
      clearInterval(scrollTime)
    }
  }
})
