let { siteList } = require('../../template/sitelist')

if ($('.mod-cotroller-site-list').length) {
  $('body').append(siteList)
  let $siteListBox = $('.mod-cotroller-site-list')

  $('.form-siteSearch').on('submit', function (event) {
    event.preventDefault()
    let $this = $(this)
    $.post($this.attr('action'), $this.serialize()).then(function (res) {
      let result = res.result
      if (!result.data) {
        $('.mod-cotroller-site-list tbody').html(`<tr><td colspan="10">
        <div class="none-data-box tc active">
          <span>暂无数据</span>
        </div></td></tr>`)
        return false
      }
      $.pub('getSiteList', res)
    })
  })

  $.sub('getSiteList', function (event, res) {
    let sites = res.result
    let siteGroup = res.siteGroup

    {
      let hasCurrentGroup = false

      $.each(siteGroup, function (index, item) {
        if (item.groupId === currentGroup) {
          hasCurrentGroup = true
        }
      })

      if (!hasCurrentGroup) {
        currentGroup = -1
        $.cookie.set('51la_sc', -1)
      }
    }

    $siteListBox.data('sites', sites.data)
    $siteListBox.data('siteGroup', siteGroup)

    sitesRender({
      data: sites.data,
      currentGroupId: parseInt($.cookie.get('51la_sc'), 10) || -1
    })

    {
      // 修改站点分组
      let siteGroupHtml = ''

      $.each(siteGroup, function (index, item) {
        siteGroupHtml += `<li data-id="${item.groupId}">${item.groupName}</li>`
      })

      let $siteGroup = $(`<div class="mod-siteGroup"><ul class="mod-siteGroupList">${siteGroupHtml}</ul></div>`).appendTo('body')

      $('body').on('click', '.btn-updateGroup', function (event) {
        let $this = $(this)
        let offset = this.getBoundingClientRect()
        let top = offset.top + $this.height() + $(document).scrollTop() + 10
        let groupId = $this.attr('data-id')
        $siteGroup.find('.active').removeClass('active')
        $siteGroup.find('[data-id="' + groupId + '"]').addClass('active')
        if (top + $siteGroup.height() > document.body.scrollHeight) {
          top = top - $siteGroup.height() - $this.height() - 20
        }
        $siteGroup.data({
          'comId': $this.attr('data-comid'),
          'caller': $this
        }).css({
          left: offset.left,
          top: top,
          display: 'block'
        })
        // $('body').css('overflow', 'hidden')
        return false
      })

      $siteGroup.on('click', 'li', function (event) {
        $.post('/user/site/updateGroup', {
          groupId: $(this).attr('data-id'),
          comId: $siteGroup.data('comId'),
          _csrf: $('[name="_csrf"]').val()
        }).then(function (res) {
          if (res.code === 200) {
            $.alert({ text: '更新分组成功！', status: 3 })
          } else {
            $.alert({ text: res.msg[0].value, status: 2 })
          }
        })
        $siteGroup.css('display', 'none')
        $siteGroup.data('caller').text($(this).text())
        $siteGroup.data('caller').attr('data-id', $(this).attr('data-id'))
        return false
      })

      $('body').on('click.updateGroup', function () {
        $siteGroup.css('display', 'none')
      })
    }

    {
      // 创建分组tabs
      let siteGroupTabsHtml = ''
      $.each(sites.data.groups, function (index, item) {
        siteGroupTabsHtml += `<a href="javascript:;" class="item ${item.groupId == currentGroup ? 'active' : ''}" data-name="${item.groupName}" data-id="${item.groupId}">
          ${item.groupName}
          <span>${item.siteNum}</span>
      </a>`
      })

      $('.mod-cotroller-site-group').show().html(siteGroupTabsHtml)
      let $currentGroup = $('.item[data-id="' + currentGroup + '"]')
      getGroupAumount(sites.data.sites, currentGroup, $currentGroup.attr('data-name'))
    }
  })

  $('.submit-search').on('click', function () {
    $('.form-siteSearch').trigger('submit')
  })

  $('.form-siteSearch').trigger('submit')

  // 删除站点功能 ******
  $('body').on('click', '.btn-removeSite', function () {
    var $this = $(this)

    var layeRemoveSite = $('#layer-removeSite').IUI('layer', {
      content: $('#tpl-removeSite').html(),
      offsetWidth: 800
    })

    layeRemoveSite.showLayer()

    $('.input-siteId').val($this.data('id'))

    $('.form-removeSite').IUI('ajaxForm', {
      before: function (event, config) {
        var $this = $(this)
        var pass = $this.find('input[name="pass"]').val()
        if (!pass) {
          $.alert({
            text: '密码不能为空',
            status: 0
          })
          return false
        }
        config.data = $this.serialize() + '&_csrf=' + $('[name="_csrf"]').val()
      },
      success: function (res, config) {
        if (res.code === 200) {
          $.alert({
            text: '成功删除统计ID',
            status: 3
          })
          window.location.href = window.location.href
        } else {
          $.alert({
            text: res.msg[0].value,
            status: 2
          })
        }
      }
    })
  })

  //  站点列表排序功能
  $('body').on('click', '.c-table-btn-sort', function (event) {
    var type = $(this).hasClass('desc') ? 1 : 2
    var propName = $(this).attr('data-sorttype')
    let data = $('.mod-cotroller-site-list').data('sites')
    $('.c-table-btn-sort').removeClass('asc desc')

    if (!data) {
      return false
    }

    if (type === 1) {
      $(this).addClass('asc')
    } else {
      $(this).addClass('desc')
    }

    data.sites.sort(function (a, b) {
      if (type === 1) {
        if (a[propName]) {
          return a[propName] - b[propName]
        } else {
          return a.stat[propName] - b.stat[propName]
        }
      }
      if (type === 2) {
        if (a[propName]) {
          return b[propName] - a[propName]
        } else {
          return b.stat[propName] - a.stat[propName]
        }
      }
    })
    sitesRender({
      data: data,
      currentGroupId: parseInt($('.c-tabs-bubble-tip').find('.active').attr('data-id'))
    })
  })

  $('.mod-cotroller-site-group').on('click', '.item', function (event) {
    let $this = $(this)
    let groupId = $this.data('id')
    let $item = $('.mod-cotroller-site-list').find('.item')
    let sitesData = $('.mod-cotroller-site-list').data('sites')
    if (!sitesData) {
      return false
    }
    if ($this.hasClass('active')) {
      return false
    }

    $this.addClass('active').siblings('.active').removeClass('active')

    if (groupId === -1) {
      $item.removeClass('hide')
    } else if (groupId === -2) {
      $item.addClass('hide')
      $('[data-groupshow="1"]').removeClass('hide')
    } else {
      $item.addClass('hide')
      $('[data-groupid="' + groupId + '"]').removeClass('hide')
    }
    $.cookie.set('51la_sc', groupId)

    getGroupAumount(sitesData.sites, groupId, $this.attr('data-name'))
  })
}

// 站点对比功能
if ($('.table-compare').length) {
  $('.select-site-list').on('change', function (event) {
    let $this = $(this)
    let index = $('.select-site-list').index($this)
    let $comId = $('.comId').eq(index)
    let $online = $('.online').eq(index)
    let $date = $('.date').eq(index)
    let $ip = $('.ip').eq(index)
    let $pv = $('.pv').eq(index)
    let $newUv = $('.newUv').eq(index)
    let $vv = $('.vv').eq(index)
    let $searchEngine = $('.searchEngine').eq(index)
    let $spider = $('.spider').eq(index)
    let $keyword = $('.keyword').eq(index)
    let $referrer = $('.referrer').eq(index)
    let $province = $('.province').eq(index)
    let tableH = $('.c-table').height()
    let columnW = $this.closest('th').outerWidth()
    let tableOffset = $this.closest('th').offset()
    $('body').append(`<div class="mask-${index}" style="width:${columnW}px;height:${tableH}px;position:absolute;z-index:999999;background-color:rgba(255,255,255,0.5);left:${tableOffset.left}px;top:${tableOffset.top}px;"></div>`)
    let values = []
    $('.select-site-list').each(function (index, el) {
      values.push(el.value)
    })
    $.cookie.set('51la_compare', values.join(','))
    $.post('/user/site/compare', { comId: $(this).val(), _csrf: $('[name="_csrf"]').val() }).then(function (res) {
      $('.mask-' + index).remove()

      if (!res) {
        $comId.text('')
        $online.text('')
        $date.text('')
        $ip.text('')
        $pv.text('')
        $newUv.text('')
        $vv.text('')
        $searchEngine.text('')
        $spider.text('')
        $keyword.text('')
        $referrer.text('')
        $province.text('')
        return false
      }
      let flowSum = res.flowSum
      let onlineSum = res.onlineSum
      let searchEngine = res.searchEngineSum
      let spider = res.spiderSum
      let keyword = res.keywordSum
      let referrer = res.referSum
      let province = res.provinceSum
      let comId = $this.val()
      $comId.html(`${comId}&nbsp;<a href="/report/main?comId=${comId}" target="_blank">详细</a>`)

      if (flowSum.code === 200) {
        let data = flowSum.data.dayHistory
        $ip.text(data ? data[0].ip : '-')
        $pv.text(data ? data[0].pv : '-')
        $vv.text(data ? data[0].frequency : '-')
        $newUv.text(data ? data[0].newUv : '-')
        $date.text(data ? data[0].dayId : '-')
      }

      if (onlineSum.code === 200) {
        $online.text(onlineSum.data.lastFiftyMin || '-')
      }

      if (searchEngine.code === 200) {
        let data = searchEngine.data.list
        $searchEngine.html(data ? htmlConcat(data) : '-')
      }

      if (spider.code === 200) {
        $spider.html(htmlConcat(spider.data))
      }

      if (keyword.code === 200) {
        $keyword.html(keyword.data ? htmlConcat(keyword.data.list) : '-')
      }

      if (referrer.code === 200) {
        $referrer.html(referrer.data ? htmlConcat(referrer.data.list) : '-')
      }
      if (province.code === 200) {
        $province.html(province.data ? htmlConcat(province.data.list) : '-')
      }
    })
  })

  let _data = '<option value="">请选择你要比对的站点</option>'
  $.post('/user/site/list/dropdown', {
    _csrf: $('[name="_csrf"]').val()
  }, function (res) {
    if (res.code === 401) {

    } else {
      let OWNER_SITES = JSON.parse(res)
      $.each(OWNER_SITES, function (index, value) {
        _data += `<option value="${value.comId}">${value.name}</option>`
      })
      $('.select-site-list').html(_data)
    }
    let cookieStore = ($.cookie.get('51la_compare') || '').split(',')
    $.each(cookieStore, function (index, item) {
      if (item && typeof Number(item) === 'number') {
        $('.select-site-list').eq(index).val(item).trigger('change')
      }
    })
  })

  $('.btn-all-fresh').on('click', function () {
    $('.select-site-list').trigger('change')
  })

  $('.btn-all-clear').on('click', function () {
    $('tr').find('td:gt(0)').text('')

    $('.select-site-list').each(function (index, el) {
      el.value = ''
    })
    $.cookie.remove('51la_compare')
  })
}

require('./group')()
require('./edit')()
require('./siteAdd')()
require('./center')()
require('./feedback')()

function htmlConcat(arr) {
  let str = '<table width="100%">'
  $.each(arr, function (index, item) {
    str += `<tr><td>${item.name || item.keyword || item.src}</td><td width="50">${item.value === undefined ? item.ip : item.value}</td></tr>`
  })
  str += '</table>'
  return str
}

function numformat(val) {
  return (val + '').replace(/\b(\d+)((\.\d+)*)\b/g, function (a, b, c) { return (b.charAt(0) > 0 && !(c || '.').lastIndexOf('.') ? b.replace(/(\d)(?=(\d{3})+$)/g, '$1,') : b) + c })
}

function sitesRender(data) {
  let html = template.compile($('#tpl-siteList').html())(data)
  $('.mod-cotroller-site-list tbody').remove()
  $('.mod-cotroller-site-list table').append(html)
}

function getGroupAumount(sites, groupId, groupName) {
  let todayIpMount = 0
  let todayPvMount = 0
  let yesterdayPvMount = 0
  let yesterdayIpMount = 0
  let siteMount = 0

  $.each(sites, function (index, item) {
    if (item.groupId === groupId || groupId === -1) {
      todayIpMount += item.stat.todayIp
      todayPvMount += item.stat.todayPv
      yesterdayPvMount += item.stat.yesterdayPv
      yesterdayIpMount += item.stat.yesterdayIp
      siteMount += 1
    }
  })

  $('.sites-info').text(` 今日合计：${numformat(todayIpMount)} IP / ${numformat(todayPvMount)} PV ┆ 昨日合计：${numformat(yesterdayIpMount)} IP / ${numformat(yesterdayPvMount)} PV（合计 ${groupName} 的 ${numformat(siteMount)}个ID）`)
}
