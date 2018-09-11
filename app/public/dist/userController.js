/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 388);
/******/ })
/************************************************************************/
/******/ ({

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// <div class="c-paging-box">
//   <div class="c-paging-box-right">
//     <span class="total">共<i>{{total}}</i>条&nbsp&nbsp当前第{{pageNum}}页&nbsp&nbsp</span>
//     <span class="show-page">每页显示</span>&nbsp
//     <input type="text" class="show-page-num" maxlength="2" value="{{pageSize}}">&nbsp
//     <span class="show-page2">条</span>
//     <span class="text-go">跳转至</span>
//     <input type="text" maxlength="2" class="go-page">
//     <div class="box-a">
//         <a  href="javascript:;" data-perpage="{{prev}}" {{prev === 0 ? 'class=disabled' : ''}}>«</a>
//         {{each lists as item }}
//         <a  href="javascript:" data-perpage="{{item.index}}" {{item.isActive ? 'class=on' : ''}}>{{item.index}}</a>
//         {{/each}}
//         <a  href="javascript:;" data-perpage="{{next}}" {{next === 0 ? 'class=disabled' : ''}}>»</a>
//     </div>
//   </div>
// </div>
var pageTemplate = '\n<div class="c-pagination-wrap clearfix">\n  \u603B\u5171{{total}}\u6761\u6570\u636E&nbsp&nbsp\n  \u6BCF\u9875<input type="text" class="pagesize" role="text" maxlength="2" value="{{pageSize}}">\n  \u8DF3\u8F6C\u81F3<input type="text" class="goto" role="text" maxlength="2" data-maxpage="{{maxpage}}">\n  <ul class="c-pagination">\n    <li class="prev {{prev === 0 ? \'disabled\' : \'\'}}" data-page={{prev}}><a href="javascript:;">\xAB</a></li>\n    {{each lists as item }}\n      <li  {{item.isActive ? \'class=active\' : \'\'}} data-page="{{item.index}}">\n        <a href="javascript:;">{{item.index}}</a>\n      </li>\n    {{/each}}\n    <li class="next {{next === 0 ? \'disabled\' : \'\'}}" data-page="{{next}}"><a href="javascript:;">\xBB</a></li>\n  </ul>\n</div>\n';
function Pagination($form, option) {
  var _this = this;
  _this.config = $.extend(true, {}, option);
  _this.$form = $form;
  _this.template = pageTemplate;
  _this.config.data.url = fixUrl(_this.config.url || _this.$form.attr('action') || '');
}

Pagination.prototype.init = function (selector) {
  var render = template.compile(this.template);
  var data = $.extend(true, {}, this.config.data);
  var serialize = this.$form.serialize();

  data.url += serialize;
  data.prev = createPrev(data);

  data.next = createNext(data);

  data.lists = createLists(data);

  if (data.total === 0) {
    return false;
  }

  this.event(selector);

  return render(data);
};

Pagination.prototype.event = function (selector) {
  var $selector = selector;
  var _this = this;

  $selector.on('click', '[data-page]', function (event) {
    event.preventDefault();
    var $this = $(this);
    if (!$this.hasClass('disabled')) {
      _this.$form.find('[name="pageNum"]').val($this.attr('data-page'));
      _this.$form.submit();
    }
  });

  $selector.on('keydown', '.goto', function (event) {
    var $this = $(this);
    if (event.keyCode === 13) {
      _this.$form.find('[name="pageNum"]').val($this.val());
      _this.$form.submit();
    }
  });

  $selector.on('keydown', '.pagesize', function (event) {
    var $this = $(this);
    if (event.keyCode === 13) {
      _this.$form.find('[name="pageSize"]').val($this.val());
      _this.$form.submit();
    }
  });
};

function createPrev(data) {
  var num = data.pageNum;
  return data.pageNum === 1 ? 0 : num - 1;
}

function createNext(data) {
  var num = data.pageNum;
  return data.pageNum === data.pages ? 0 : num + 1;
}

function fixUrl(url) {
  var _url;
  if (url.indexOf('?') !== -1) {
    _url = url.split('?')[0];
  } else if (url.indexOf('#') !== -1) {
    _url = url.split('#')[0];
  } else {
    _url = url;
  }

  return _url + '?';
}
function createLists(data) {
  var arr = [];
  var queue = data.pages >= 5 ? 5 : data.pages;
  var pageNum = void 0;
  arr.length = queue;
  if (data.pages < 5 || data.pageNum < 3) {
    pageNum = 1;
  } else if (data.pageNum >= data.pages - Math.round(arr.length / 2)) {
    pageNum = data.pages - 4;
  } else {
    pageNum = data.pageNum - 2;
  }

  $.each(arr, function (index, value) {
    arr[index] = {
      index: pageNum + index,
      isActive: pageNum + index === data.pageNum
    };
  });

  return arr.slice(0);
}

module.exports = Pagination;

/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(389),
    siteList = _require.siteList;

if ($('.mod-cotroller-site-list').length) {
  $('body').append(siteList);
  var $siteListBox = $('.mod-cotroller-site-list');

  $('.form-siteSearch').on('submit', function (event) {
    event.preventDefault();
    var $this = $(this);
    $.post($this.attr('action'), $this.serialize()).then(function (res) {
      var result = res.result;
      if (!result.data) {
        $('.mod-cotroller-site-list tbody').html('<tr><td colspan="10">\n        <div class="none-data-box tc active">\n          <span>\u6682\u65E0\u6570\u636E</span>\n        </div></td></tr>');
        return false;
      }
      $.pub('getSiteList', res);
    });
  });

  $.sub('getSiteList', function (event, res) {
    var sites = res.result;
    var siteGroup = res.siteGroup;

    {
      var hasCurrentGroup = false;

      $.each(siteGroup, function (index, item) {
        if (item.groupId === currentGroup) {
          hasCurrentGroup = true;
        }
      });

      if (!hasCurrentGroup) {
        currentGroup = -1;
        $.cookie.set('51la_sc', -1);
      }
    }

    $siteListBox.data('sites', sites.data);
    $siteListBox.data('siteGroup', siteGroup);

    sitesRender({
      data: sites.data,
      currentGroupId: parseInt($.cookie.get('51la_sc'), 10) || -1
    });

    {
      // 修改站点分组
      var siteGroupHtml = '';

      $.each(siteGroup, function (index, item) {
        siteGroupHtml += '<li data-id="' + item.groupId + '">' + item.groupName + '</li>';
      });

      var $siteGroup = $('<div class="mod-siteGroup"><ul class="mod-siteGroupList">' + siteGroupHtml + '</ul></div>').appendTo('body');

      $('body').on('click', '.btn-updateGroup', function (event) {
        var $this = $(this);
        var offset = this.getBoundingClientRect();
        var top = offset.top + $this.height() + $(document).scrollTop() + 10;
        var groupId = $this.attr('data-id');
        $siteGroup.find('.active').removeClass('active');
        $siteGroup.find('[data-id="' + groupId + '"]').addClass('active');
        if (top + $siteGroup.height() > document.body.scrollHeight) {
          top = top - $siteGroup.height() - $this.height() - 20;
        }
        $siteGroup.data({
          'comId': $this.attr('data-comid'),
          'caller': $this
        }).css({
          left: offset.left,
          top: top,
          display: 'block'
        });
        // $('body').css('overflow', 'hidden')
        return false;
      });

      $siteGroup.on('click', 'li', function (event) {
        $.post('/user/site/updateGroup', {
          groupId: $(this).attr('data-id'),
          comId: $siteGroup.data('comId'),
          _csrf: $('[name="_csrf"]').val()
        }).then(function (res) {
          if (res.code === 200) {
            $.alert({ text: '更新分组成功！', status: 3 });
          } else {
            $.alert({ text: res.msg[0].value, status: 2 });
          }
        });
        $siteGroup.css('display', 'none');
        $siteGroup.data('caller').text($(this).text());
        $siteGroup.data('caller').attr('data-id', $(this).attr('data-id'));
        return false;
      });

      $('body').on('click.updateGroup', function () {
        $siteGroup.css('display', 'none');
      });
    }

    {
      // 创建分组tabs
      var siteGroupTabsHtml = '';
      $.each(sites.data.groups, function (index, item) {
        siteGroupTabsHtml += '<a href="javascript:;" class="item ' + (item.groupId == currentGroup ? 'active' : '') + '" data-name="' + item.groupName + '" data-id="' + item.groupId + '">\n          ' + item.groupName + '\n          <span>' + item.siteNum + '</span>\n      </a>';
      });

      $('.mod-cotroller-site-group').show().html(siteGroupTabsHtml);
      var $currentGroup = $('.item[data-id="' + currentGroup + '"]');
      getGroupAumount(sites.data.sites, currentGroup, $currentGroup.attr('data-name'));
    }
  });

  $('.submit-search').on('click', function () {
    $('.form-siteSearch').trigger('submit');
  });

  $('.form-siteSearch').trigger('submit');

  // 删除站点功能 ******
  $('body').on('click', '.btn-removeSite', function () {
    var $this = $(this);

    var layeRemoveSite = $('#layer-removeSite').IUI('layer', {
      content: $('#tpl-removeSite').html(),
      offsetWidth: 800
    });

    layeRemoveSite.showLayer();

    $('.input-siteId').val($this.data('id'));

    $('.form-removeSite').IUI('ajaxForm', {
      before: function before(event, config) {
        var $this = $(this);
        var pass = $this.find('input[name="pass"]').val();
        if (!pass) {
          $.alert({
            text: '密码不能为空',
            status: 0
          });
          return false;
        }
        config.data = $this.serialize() + '&_csrf=' + $('[name="_csrf"]').val();
      },
      success: function success(res, config) {
        if (res.code === 200) {
          $.alert({
            text: '成功删除统计ID',
            status: 3
          });
          window.location.href = window.location.href;
        } else {
          $.alert({
            text: res.msg[0].value,
            status: 2
          });
        }
      }
    });
  });

  //  站点列表排序功能
  $('body').on('click', '.c-table-btn-sort', function (event) {
    var type = $(this).hasClass('desc') ? 1 : 2;
    var propName = $(this).attr('data-sorttype');
    var data = $('.mod-cotroller-site-list').data('sites');
    $('.c-table-btn-sort').removeClass('asc desc');

    if (!data) {
      return false;
    }

    if (type === 1) {
      $(this).addClass('asc');
    } else {
      $(this).addClass('desc');
    }

    data.sites.sort(function (a, b) {
      if (type === 1) {
        if (a[propName]) {
          return a[propName] - b[propName];
        } else {
          return a.stat[propName] - b.stat[propName];
        }
      }
      if (type === 2) {
        if (a[propName]) {
          return b[propName] - a[propName];
        } else {
          return b.stat[propName] - a.stat[propName];
        }
      }
    });
    sitesRender({
      data: data,
      currentGroupId: parseInt($('.c-tabs-bubble-tip').find('.active').attr('data-id'))
    });
  });

  $('.mod-cotroller-site-group').on('click', '.item', function (event) {
    var $this = $(this);
    var groupId = $this.data('id');
    var $item = $('.mod-cotroller-site-list').find('.item');
    var sitesData = $('.mod-cotroller-site-list').data('sites');
    if (!sitesData) {
      return false;
    }
    if ($this.hasClass('active')) {
      return false;
    }

    $this.addClass('active').siblings('.active').removeClass('active');

    if (groupId === -1) {
      $item.removeClass('hide');
    } else if (groupId === -2) {
      $item.addClass('hide');
      $('[data-groupshow="1"]').removeClass('hide');
    } else {
      $item.addClass('hide');
      $('[data-groupid="' + groupId + '"]').removeClass('hide');
    }
    $.cookie.set('51la_sc', groupId);

    getGroupAumount(sitesData.sites, groupId, $this.attr('data-name'));
  });
}

// 站点对比功能
if ($('.table-compare').length) {
  $('.select-site-list').on('change', function (event) {
    var $this = $(this);
    var index = $('.select-site-list').index($this);
    var $comId = $('.comId').eq(index);
    var $online = $('.online').eq(index);
    var $date = $('.date').eq(index);
    var $ip = $('.ip').eq(index);
    var $pv = $('.pv').eq(index);
    var $newUv = $('.newUv').eq(index);
    var $vv = $('.vv').eq(index);
    var $searchEngine = $('.searchEngine').eq(index);
    var $spider = $('.spider').eq(index);
    var $keyword = $('.keyword').eq(index);
    var $referrer = $('.referrer').eq(index);
    var $province = $('.province').eq(index);
    var tableH = $('.c-table').height();
    var columnW = $this.closest('th').outerWidth();
    var tableOffset = $this.closest('th').offset();
    $('body').append('<div class="mask-' + index + '" style="width:' + columnW + 'px;height:' + tableH + 'px;position:absolute;z-index:999999;background-color:rgba(255,255,255,0.5);left:' + tableOffset.left + 'px;top:' + tableOffset.top + 'px;"></div>');
    var values = [];
    $('.select-site-list').each(function (index, el) {
      values.push(el.value);
    });
    $.cookie.set('51la_compare', values.join(','));
    $.post('/user/site/compare', { comId: $(this).val(), _csrf: $('[name="_csrf"]').val() }).then(function (res) {
      $('.mask-' + index).remove();

      if (!res) {
        $comId.text('');
        $online.text('');
        $date.text('');
        $ip.text('');
        $pv.text('');
        $newUv.text('');
        $vv.text('');
        $searchEngine.text('');
        $spider.text('');
        $keyword.text('');
        $referrer.text('');
        $province.text('');
        return false;
      }
      var flowSum = res.flowSum;
      var onlineSum = res.onlineSum;
      var searchEngine = res.searchEngineSum;
      var spider = res.spiderSum;
      var keyword = res.keywordSum;
      var referrer = res.referSum;
      var province = res.provinceSum;
      var comId = $this.val();
      $comId.html(comId + '&nbsp;<a href="/report/main?comId=' + comId + '" target="_blank">\u8BE6\u7EC6</a>');

      if (flowSum.code === 200) {
        var data = flowSum.data.dayHistory;
        $ip.text(data ? data[0].ip : '-');
        $pv.text(data ? data[0].pv : '-');
        $vv.text(data ? data[0].frequency : '-');
        $newUv.text(data ? data[0].newUv : '-');
        $date.text(data ? data[0].dayId : '-');
      }

      if (onlineSum.code === 200) {
        $online.text(onlineSum.data.lastFiftyMin || '-');
      }

      if (searchEngine.code === 200) {
        var _data2 = searchEngine.data.list;
        $searchEngine.html(_data2 ? htmlConcat(_data2) : '-');
      }

      if (spider.code === 200) {
        $spider.html(htmlConcat(spider.data));
      }

      if (keyword.code === 200) {
        $keyword.html(keyword.data ? htmlConcat(keyword.data.list) : '-');
      }

      if (referrer.code === 200) {
        $referrer.html(referrer.data ? htmlConcat(referrer.data.list) : '-');
      }
      if (province.code === 200) {
        $province.html(province.data ? htmlConcat(province.data.list) : '-');
      }
    });
  });

  var _data = '<option value="">请选择你要比对的站点</option>';
  $.post('/user/site/list/dropdown', {
    _csrf: $('[name="_csrf"]').val()
  }, function (res) {
    if (res.code === 401) {} else {
      var OWNER_SITES = JSON.parse(res);
      $.each(OWNER_SITES, function (index, value) {
        _data += '<option value="' + value.comId + '">' + value.name + '</option>';
      });
      $('.select-site-list').html(_data);
    }
    var cookieStore = ($.cookie.get('51la_compare') || '').split(',');
    $.each(cookieStore, function (index, item) {
      if (item && typeof Number(item) === 'number') {
        $('.select-site-list').eq(index).val(item).trigger('change');
      }
    });
  });

  $('.btn-all-fresh').on('click', function () {
    $('.select-site-list').trigger('change');
  });

  $('.btn-all-clear').on('click', function () {
    $('tr').find('td:gt(0)').text('');

    $('.select-site-list').each(function (index, el) {
      el.value = '';
    });
    $.cookie.remove('51la_compare');
  });
}

__webpack_require__(390)();
__webpack_require__(391)();
__webpack_require__(392)();
__webpack_require__(393)();
__webpack_require__(394)();

function htmlConcat(arr) {
  var str = '<table width="100%">';
  $.each(arr, function (index, item) {
    str += '<tr><td>' + (item.name || item.keyword || item.src) + '</td><td width="50">' + (item.value === undefined ? item.ip : item.value) + '</td></tr>';
  });
  str += '</table>';
  return str;
}

function numformat(val) {
  return (val + '').replace(/\b(\d+)((\.\d+)*)\b/g, function (a, b, c) {
    return (b.charAt(0) > 0 && !(c || '.').lastIndexOf('.') ? b.replace(/(\d)(?=(\d{3})+$)/g, '$1,') : b) + c;
  });
}

function sitesRender(data) {
  var html = template.compile($('#tpl-siteList').html())(data);
  $('.mod-cotroller-site-list tbody').remove();
  $('.mod-cotroller-site-list table').append(html);
}

function getGroupAumount(sites, groupId, groupName) {
  var todayIpMount = 0;
  var todayPvMount = 0;
  var yesterdayPvMount = 0;
  var yesterdayIpMount = 0;
  var siteMount = 0;

  $.each(sites, function (index, item) {
    if (item.groupId === groupId || groupId === -1) {
      todayIpMount += item.stat.todayIp;
      todayPvMount += item.stat.todayPv;
      yesterdayPvMount += item.stat.yesterdayPv;
      yesterdayIpMount += item.stat.yesterdayIp;
      siteMount += 1;
    }
  });

  $('.sites-info').text(' \u4ECA\u65E5\u5408\u8BA1\uFF1A' + numformat(todayIpMount) + ' IP / ' + numformat(todayPvMount) + ' PV \u2506 \u6628\u65E5\u5408\u8BA1\uFF1A' + numformat(yesterdayIpMount) + ' IP / ' + numformat(yesterdayPvMount) + ' PV\uFF08\u5408\u8BA1 ' + groupName + ' \u7684 ' + numformat(siteMount) + '\u4E2AID\uFF09');
}

/***/ }),

/***/ 389:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var siteList = "\n<script type=\"text/html\" id=\"tpl-removeSite\">\n<form class=\"fomr-vertical form-removeSite\" action=\"/user/site/remove\" onsubmit=\"return false\">\n  <input type=\"hidden\" name=\"comId\" class=\"input-siteId\">\n  <div class=\"layer-header clearfix\">\n    <div class=\"pull-left\">\n      <div class=\"layer-title\">\u5220\u9664ID</div>\n    </div>\n    <div class=\"pull-right\"><a href=\"javascript:;\" class=\"btn-close icon-close\"></a></div>\n  </div>\n  <div class=\"layer-body\">\n    <p class=\"text-danger\">\u5220\u9664\u540E\u5C06\u4E0D\u53EF\u6062\u590D\uFF01\u60A8\u771F\u7684\u8981\u5220\u9664\u8FD9\u4E2A\u7EDF\u8BA1ID\u5417\uFF1F</p>\n    <p>\u5982\u679C\u60A8\u53EA\u662F\u4E3A\u4E86\u6E05\u9664\u6570\u636E\uFF0C\u5219\u53EF\u4EE5\u4F7F\u7528\u521D\u59CB\u5316\u529F\u80FD\uFF0C\u8FD9\u6837\u7EDF\u8BA1ID\u548C\u7EDF\u8BA1\u4EE3\u7801\u5C06\u4E0D\u4F1A\u6539\u53D8\u3002</p>\n    <p class=\"mt20\">\u5982\u679C\u60A8\u7684\u8BE6\u60C5\u6570\u636E\u8F83\u591A\uFF08\u6BD4\u5982\u6709\u6210\u5343\u4E0A\u4E07\u7684\u9875\u9762\u6216\u8005\u5173\u952E\u8BCD\uFF09\uFF0C\u5E76\u4E14\u4F7F\u7528\u7EDF\u8BA1\u65F6\u95F4\u8F83\u957F\u65F6\uFF0C\u5219\u5220\u9664\u64CD\u4F5C\u53EF\u80FD\u9700\u8981\u5F88\u957F\u65F6\u95F4\u3002\u5728\u6B64\u671F\u95F4\u8BF7\u60A8\u8010\u5FC3\u7B49\u5F85\uFF0C\u4E0D\u8981\u5173\u95ED\u7A97\u53E3\u6216\u8005\u5207\u6362\u5230\u5176\u5B83\u9875\u9762\u3002\u5982\u679C\u4E2D\u9014\u51FA\u9519\uFF0C\u60A8\u53EF\u4EE5\u91CD\u65B0\u8FDB\u884C\u5220\u9664\u64CD\u4F5C\u3002</p>\n    <p class=\"mt20 text-danger\">\u8C28\u614E\uFF01\u8C28\u614E\uFF01\uFF01\u8C28\u614E\uFF01\uFF01\uFF01</p>\n\n    <div class=\"form-group-sm\">\n      <div class=\"form-vertical mt20\">\n        <div class=\"col-2 tl\">\n          <label class=\"name-sm\">\u5BC6\u7801\u786E\u8BA4</label>\n        </div>\n        <div class=\"col-4 pr\">\n          <input type=\"password\" name=\"pass\" class=\"form-control-sm\" placeholder=\"\u5BC6\u7801\" data-required=\"pass\" class=\"form-control-sm\">\n        </div>\n        <div class=\"col-5 text-muted f14 ml20 mt5\">\n          ( \u8BF7\u8F93\u5165\u60A8\u7684\u767B\u5F55\u5BC6\u7801 )\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"layer-footer\">\n    <a href=\"javascript:;\" class=\"btn btn-close btn-default\">\u53D6\u6D88</a>\n    <button type=\"submit\" class=\"btn btn-danger ml40\">\u5220\u9664</button>\n  </div>\n</form>\n</script>\n<script id=\"tpl-createGroup\" type=\"text/html\">\n<div class=\"layer-header clearfix\">\n  <div class=\"pull-left\">\n    <div class=\"layer-title\">{{title}}</div>\n  </div>\n  <div class=\"pull-right\"><a href=\"javascript:;\" class=\"btn-close icon-close\"></a></div>\n</div>\n<form class=\"c-form-vertical c-form-vertical-s form-createGroup\" action=\"{{url}}\" onsubmit=\"return false\">\n  {{if groupId}}\n  <input type=\"hidden\" name=\"groupId\" value=\"{{groupId}}\"> {{/if}}\n  <input type=\"hidden\" name=\"groupShow\" value=\"1\">\n  <input type=\"hidden\" name=\"groupColor\"  value=\"#fff\">\n  <div class=\"layer-body\">\n    <div class=\"form-group\">\n      <div class=\"col-2\"><label class=\"form-label\">\u5206\u7EC4\u540D\u79F0</label></div>\n      <div class=\"col-5 pr\"><input type=\"text\" maxlength=\"8\" name=\"groupName\" data-required=\"groupName\" class=\"form-control\" value=\"{{groupName}}\"></div>\n      <div class=\"col-4 text-muted mt5\">8\u4E2A\u5B57\u7B26\uFF08\u62168\u4E2A\u6C49\u5B57\uFF09\u4EE5\u5185</div>\n    </div>\n  </div>\n  <div class=\"layer-footer\">\n    <a href=\"javascript:;\" class=\"btn btn-close btn-default\">\u53D6\u6D88</a>\n    <button type=\"submit\" class=\"btn btn-primary ml20\">\u786E\u5B9A</button>\n  </div>\n</form>\n</script>\n<script id=\"tpl-editGroup\" type=\"text/html\">\n<div class=\"layer-header clearfix\">\n  <div class=\"pull-left\">\n    <div class=\"layer-title\">\u7F16\u8F91\u5206\u7EC4</div>\n  </div>\n  <div class=\"pull-right\"><a href=\"javascript:;\" class=\"btn-close icon-close\"></a></div>\n</div>\n<div class=\"layer-body mod-cotroller-sitegroup-edit\">\n  <div class=\"edit-content\">\n    <div class=\"edit-header clearfix\">\n      <div class=\"pull-left\">\u5206\u7EC4\u540D\u79F0\uFF088\u4E2A\u5B57\u7B26\u62168\u4E2A\u6C49\u5B57\u5185\uFF09</div>\n      <div class=\"pull-right\">\u64CD\u4F5C</div>\n    </div>\n    <div class=\"edit-body\">\n      {{each data as item}}\n      {{if item.groupId !== 1}}\n      <div class=\"item clearfix\">\n        <div class=\"pull-left\"><input type=\"text\" value=\"{{item.groupName}}\" maxlength=\"8\" name=\"groupName\" data-edit=\"/user/siteGroup/update\" data-updateId=\"{{item.groupId}}\" data-required=\"groupName\" class=\"update-input\"></div>\n        <div class=\"pull-right lh-l\"><a href=\"javascript:;\" data-url=\"/user/siteGroup/delete?groupId={{item.groupId}}\" class=\"remove\">\u5220\u9664</a></div>\n        <div class=\"pull-right lh-l mr20\"><a href=\"javascript:;\" class=\"update-group\">\u7F16\u8F91</a></div>\n      </div>\n      {{/if}}\n      {{/each}}\n    </div>\n  </div>\n</div>\n</script>\n<script type=\"text/html\" id=\"tpl-siteList\">\n{{each data.sites as item}}\n  <tbody class=\"item {{ currentGroupId === -1 || currentGroupId == item.groupId ? '' : 'hide'}}\" data-groupid=\"{{item.groupId}}\" data-groupshow=\"{{item.groupShow}}\" data-site-id=\"{{item.comId}}\">\n    <tr>\n      <td class=\"br\" class=\"pl20\">\n        <div>{{item.siteName}}</div>\n        <a class=\"site-list-website\" target=\"_blank\" title=\"{{item.url}}\" href=\"{{item.url}}\">{{item.url }}</a>\n      </td>\n      <td>\n        {{item.comId}}\n      </td>\n      <td>\n        <div class=\"tl\">\u4ECA\u65E5</div>\n        <div class=\"tl mt5 tcolor-light\">\u6628\u65E5</div>\n      </td>\n      <td class=\"tr\">\n        <div>{{item.stat.todayIp | numformat}}</div>\n        <div class=\"mt5 tcolor-light\">{{item.stat.yesterdayIp | numformat}}</div>\n      </td>\n      <td class=\"tr\">\n        <div>{{item.stat.todayPv | numformat}}</div>\n        <div class=\"mt5 tcolor-light\">{{item.stat.yesterdayPv | numformat}}</div>\n      </td>\n      <td class=\"tc\"><a href=\"javascript:;\" class=\"btn-updateGroup\" data-comid=\"{{item.comId}}\" data-id=\"{{item.groupName ? item.groupId : 1}}\">{{item.groupName || '\u672A\u5206\u7EC4'}}</a></td>\n      <td rowspan=\"2\">\n        <a href=\"/report/main?comId={{item.comId}}\" data-url=\"/report/visit_details?comId={{item.comId}}\" class=\"mr10\">\u67E5\u770B\u62A5\u8868</a>\n        <a href=\"/report/manage/statistics?comId={{item.comId}}\" class=\"mr10\">\u83B7\u53D6\u4EE3\u7801</a>\n        <a href=\"/report/manage/setup?comId={{item.comId}}\" class=\"mr10\">\u8BBE\u7F6E</a>\n        <a href=\"javascript:;\" data-id=\"{{item.comId}}\" class=\"btn-removeSite\">\u5220\u9664</a>\n      </td>\n    </tr>\n  </tbody>\n{{/each}}\n</script>";

module.exports.siteList = siteList;

/***/ }),

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  /**
   * 分组管理
   * 分组增删改查功能
   */
  function groupIdCU(data, target) {
    var _data = data || {
      title: '新建分组',
      url: '/user/siteGroup/add',
      msg: '创建成功'
    };
    var createGroupLayer = $('#layer-createGroup').IUI('layer', {
      content: template.compile($('#tpl-createGroup').html())(_data),
      dynamic: true,
      offsetWidth: 800
    });

    createGroupLayer.showLayer();

    // jscolor.installByClassName('jscolor')

    var createGroupValidate = $('#layer-createGroup').IUI('validate', {
      collections: [{
        required: 'groupName',
        context: '.col-5',
        matches: {
          isNonEmpty: {
            errMsg: '分组名不能为空'
          },
          strictLength: {
            errMsg: '分组名称长度超过16字符，1汉字=2个字符',
            max: 16
          }
        }
      }]
    });

    $('.form-createGroup').IUI('ajaxForm', {
      before: function before(event, config) {
        var $this = $(this);
        if (createGroupValidate.batch() === false) {
          return false;
        }
        config.data = $this.serialize() + '&_csrf=' + $('[name="_csrf"]').val();
      },
      success: function success(res) {
        if (res.code === 200) {
          $('.form-createGroup').addClass('disabled');
          var formParamArr = createGroupLayer.$selector.find('form').serializeArray();
          var formParamArrList = [];
          $.each(formParamArr, function (index, value) {
            formParamArrList.push(value.value);
          });

          if (target) {
            var name = target.find('.name');
            var radio = target.find('[type="radio"]');
            var input = target.find('[type="text"]');
            var editor = target.find('#inner-editor');
            target.find('[name="store"]').val(JSON.stringify(res.data));
            name.html(formParamArrList[1]);
            input.css('background-color', formParamArrList[3]);
            input.val(formParamArrList[3]);
            editor.html(formParamArrList[3]);
            radio.removeAttr('checked');
            target.find('[value="' + formParamArrList[2] + '"]').prop('checked', true);
          }
          $.alert({
            text: res.code === 200 ? _data.msg : res.msg[0].value,
            status: 3,
            timeout: 1000,
            callback: function callback() {
              if (res.code === 200) {
                createGroupLayer.hideLayer();
                window.location.href = window.location.href;
              }
            }
          });
        } else {
          $.alert({
            text: res.msg[0].value,
            status: 2,
            timeout: 1000,
            callback: function callback() {
              if (res.code === 200) {
                createGroupLayer.hideLayer();
                // window.location.href = window.location.href
              }
            }
          });
        }
      }
    });
  }
  // 移除分组
  $('body').on('click', '.remove', function (event) {
    var $this = $(this);
    var groupName = $this.closest('.item').find('input').val();
    $.dialog({
      content: '<div class="fb f20 c333 tc">确定要删除分组“' + groupName + '”吗？</div><div class="tc mt5">(属于该分组的统计ID不会被删除)</div>',
      type: 'confirm',
      closeBtn: true,
      confirm: function confirm(deferred) {
        $.post($this.attr('data-url'), { _csrf: $('[name="_csrf"]').val() }).then(function (res) {
          if (res.code === 200) {
            $this.closest('.item').fadeOut(300, function () {
              $(this).remove();
            });
          } else {
            $this.data('lock', false);
            $.alert({
              text: res.msg[0].value,
              status: 0
            });
          }
        });
        deferred.hideDialog();
      }
    });
  });
  // 修改分组

  $('body').on('click', '.update-group', function () {
    var $this = $(this);
    var $input = $this.closest('.item').find('.update-input');
    $input.addClass('input-style').focus();
    $this.text('确定').addClass('update-submit').removeClass('update-group');
  });

  $('body').on('click', '.update-submit', function () {
    var $this = $(this);
    var $input = $this.closest('.item').find('.update-input');
    var updateName = $input.val();
    var updateId = $input.attr('data-updateId');
    $.post($input.attr('data-edit'), { groupName: updateName, groupId: updateId, _csrf: $('[name="_csrf"]').val() }).then(function (res) {
      if (res.code === 200) {
        $.alert({
          text: '修改分组名成功',
          status: 3,
          timeout: 2000,
          callback: function callback() {
            $input.removeClass('input-style');
            $this.text('编辑').addClass('update-group').removeClass('update-submit');
          }
        });
      } else {
        $this.data('lock', false);
        $.alert({
          text: res.msg[0].value,
          status: 0
        });
      }
    });
  });

  $('.btn-createGroup').on('click', function (event) {
    groupIdCU();
  });

  if ($('body').find('.btn-createGroup').length) {
    $.sub('getSiteList', function (event, res) {
      // 修改分组弹层
      var editGroupLayer = $('#layer-editGroup').IUI('layer', {
        content: template.compile($('#tpl-editGroup').html())({ data: $('.mod-cotroller-site-list').data('siteGroup') }),
        dynamic: true,
        offsetWidth: 700,
        cancelCall: function cancelCall() {
          window.location.href = window.location.href;
        }
      });
      $('body').find('.btn-editGroup').on('click', function () {
        editGroupLayer.showLayer();
      });
    });
  }
};

/***/ }),

/***/ 391:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  /**
  * 修改用户选项
  */
  $('.form-userOption').IUI('ajaxForm', {
    success: function success(res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 3,
          timeout: 2000,
          callback: function callback() {
            window.location.href = window.location.href;
          }
        });
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        });
      }
    }
  });

  /**
  * 修改密码和邮箱
  */
  if ($('.form-resetPassword').length) {
    var resetPwdValidate = $('.form-resetPassword').IUI('validate', {
      strategy: {
        confrimPass: function confrimPass() {
          var $target = this.self;
          var value = $.trim($target[0].value);
          var pass = $.trim($('input[name="newPass1"]').val());
          if (value !== pass) {
            return false;
          }
        }
      },
      collections: [{
        required: 'oriPass',
        context: '.col-5',
        matches: {
          isNonEmpty: {
            errMsg: '原始密码不能为空'
          },
          between: {
            errMsg: '密码长度为 4 - 16 位',
            range: [4, 16]
          }
        }
      }, {
        required: 'newPass',
        context: '.col-5',
        matches: {
          isNonEmpty: {
            errMsg: '新密码不能为空'
          },
          between: {
            errMsg: '密码长度为 4 - 16 位',
            range: [4, 16]
          }
        }
      }, {
        required: 'newPass2',
        context: '.col-5',
        matches: {
          isNonEmpty: {
            errMsg: '新密码不能为空'
          },
          between: {
            errMsg: '密码长度为 4 - 16 位',
            range: [4, 16]
          },
          confrimPass: {
            errMsg: '两次密码输入不一致'
          }
        }
      }]
    });

    var updateEmailValidate = $('.form-updateEmail').IUI('validate', {
      collections: [{
        required: 'pass',
        context: '.col-5 ',
        matches: {
          isNonEmpty: {
            errMsg: '密码不能为空'
          },
          between: {
            errMsg: '密码长度为 4 - 16 位',
            range: [4, 16]
          }
        }
      }, {
        required: 'email',
        context: '.col-5 ',
        matches: {
          isNonEmpty: {
            errMsg: '邮箱不能为空'
          },
          isEmail: {
            errMsg: '请输入您正确的邮箱'
          }
        }
      }]
    });
  }

  $('.form-updateEmail').IUI('ajaxForm', {
    before: function before(event, config) {
      if (updateEmailValidate.batch() === false) {
        return false;
      }
    },
    success: function success(res) {
      if (res.code === 200) {
        $.alert({
          text: ' 邮箱已更新，请前往邮箱点击激活链接完成修改。',
          status: 1
        });
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        });
      }
    },
    error: function error(errMsg, config) {
      $.alert({
        text: '数据提交失败，请稍候再试！',
        status: 0
      });
    }
  });

  $('.form-resetPassword').IUI('ajaxForm', {
    before: function before(event, config) {
      if (resetPwdValidate.batch() === false) {
        return false;
      }
    },
    success: function success(res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 1
        });
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        });
      }
    },
    error: function error(errorMsg, config) {
      $.alert({
        obj: '#message',
        text: '数据提交失败，请稍候再试！',
        status: 0
      });
    }
  });
};

/***/ }),

/***/ 392:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  /**
   * 添加统计id
   */
  if ($('.form-siteAdd').length) {
    var myValidate = $('.form-siteAdd').IUI('validate', {
      strategy: {
        numChart: function numChart(params) {
          var $target = this.self;
          var value = $target[0].value;
          if (!/^[a-zA-Z0-9\u4e00-\u9fa5]{4,16}/.test($.trim(value))) {
            return false;
          }
        },
        httpReg: function httpReg() {
          var $target = this.self;
          var value = $.trim($target[0].value);
          if (!/^((https|http)?:\/\/)[^\s]+/.test(value)) {
            return false;
          }
        }
      },
      collections: [{
        required: 'name',
        context: '.col-4',
        matches: {
          isNonEmpty: {
            errMsg: '网站名不能为空'
          },
          between: {
            errMsg: '网站名称长度须在4-100字符以内',
            range: [4, 100]
            // ,
            // numChart : {
            //   errMsg : '可使用数字、英文字母和中文，4-16个字符'
            // }
          } }
      }, {
        required: 'url',
        context: '.col-4',
        matches: {
          isNonEmpty: {
            errMsg: '网站地址不能为空'
          },
          httpReg: {
            errMsg: '请填写正确的网站地址'
          }
        }
      }]
    });

    $('.form-siteAdd').IUI('ajaxForm', {
      before: function before(event, config) {
        if (myValidate.batch() === false) {
          return false;
        }
        $.loading(true, 'css');
      },
      success: function success(res) {
        $.loading(false, 'css');
        if (res.code === 200) {
          window.location.href = '/user/site/site_result?comId=' + res.data.comId;
        } else {
          $.alert({
            text: res.msg[0].value,
            status: 2,
            timeout: 3000
          });
        }
      },
      error: function error() {
        $.alert({
          text: '数据提交失败，请稍候再试',
          status: 0
        });
      }
    });
  }
};

/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  if ($('#mod-usercenter').length === 0) {
    return false;
  }
  var $addEmail = $('.add-email');
  var $updateEmail = $('.update-email');
  var $checkOldEmail = $('.form-checkOldEmail');
  var $setEmail = $('.form-setEmail');
  var checkOldEmail = $('#layer-check-user-email').IUI('layer', { offsetWidth: 700 });
  var createReviseEmail = $('#layer-user-email').IUI('layer', { offsetWidth: 700 });
  var $sendEmailCode = $('#reset-email-code');
  function countdown(elem) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
    var callback = arguments[3];

    // 重置倒计时
    if (action === 0) {
      clearInterval(elem.data('countdownTimer'));
      elem.data('countdownSecond', second);
      elem.text(elem.data('countdownInitText'));
      elem.data('countdownStatus', false);
      return false;
    } else if (action === 1 && elem.data('countdownStatus')) {
      // 正在倒计时，防重复点击
      return false;
    } else {
      elem.data('countdownSecond', second);
      elem.data('countdownInitText', elem.text());
      elem.text(elem.data('countdownSecond') + '秒后重新发送');
      elem.data('countdownStatus', true);
      elem.data('countdownTimer', setInterval(function () {
        elem.data('countdownSecond', elem.data('countdownSecond') - 1);
        elem.text(elem.data('countdownSecond') + '秒后重新发送');
        if (elem.data('countdownSecond') === 0) {
          elem.text(elem.data('countdownInitText'));
          elem.data('countdownStatus', false);
          clearInterval(elem.data('countdownTimer'));
        }
      }, 1000));

      callback();
    }
  }

  function sendCode(event) {
    var $this = $(this);
    var $form = $this.closest('form');
    var url = $this.attr('data-url');
    var options = $form.serialize();
    countdown($this, 1, 60, function () {
      $.post(url, options).then(function (res) {
        if (res.code === 200) {
          $.alert({ text: '验证码已成功发送，请查收！', status: 3 });
        } else {
          countdown($this, 0);
          $.alert({ text: res.msg[0].value, status: 2 });
        }
      });
    });
  }

  $addEmail.on('click', function () {
    createReviseEmail.showLayer();
  });
  $updateEmail.on('click', function () {
    checkOldEmail.showLayer();
  });
  $sendEmailCode.on('click', sendCode);
  $checkOldEmail.IUI('ajaxForm', {
    success: function success(res) {
      if (res.code === 200) {
        $checkOldEmail[0].reset();
        checkOldEmail.hideLayer();
        createReviseEmail.showLayer();
        $.alert({ text: '邮箱正确！', status: 3, timeout: 2000 });
      } else {
        $('[name="oldEmail"]').focus();
        $.alert({ text: '邮箱错误！', status: 2, timeout: 2000 });
      }
    }
  });
  $setEmail.IUI('ajaxForm', {
    success: function success(res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 3,
          timeout: 2000,
          callback: function callback() {
            window.location.href = '';
          }
        });
      } else {
        $.alert({ text: res.msg[0].value, status: 2, timeout: 2000 });
      }
    }
  });

  var $addMobile = $('.add-mobile');
  var $updateMobile = $('.update-mobile');
  var $checkOldMobile = $('.form-checkOldMobile');
  var $reviseMobile = $('.form-reviseMobile');
  var $sendMobileCode = $('#reset-mobile-code');
  var checkOldMobile = $('#layer-check-user-mobile').IUI('layer', { offsetWidth: 700 });
  var createReviseMobile = $('#layer-user-mobile').IUI('layer', { offsetWidth: 700 });
  var createReviseResetMobile = $('#layer-user-resetmobile').IUI('layer', { offsetWidth: 700 });
  $sendMobileCode.on('click', sendCode);
  $updateMobile.on('click', function () {
    checkOldMobile.showLayer();
  });
  $addMobile.on('click', function () {
    createReviseResetMobile.showLayer();
  });
  $checkOldMobile.IUI('ajaxForm', {
    success: function success(res) {
      if (res.code === 200) {
        $checkOldEmail[0].reset();
        checkOldMobile.hideLayer();
        createReviseResetMobile.showLayer();
        $.alert({ text: '手机号正确！', status: 3, timeout: 2000 });
      } else {
        $('[name="OldMobile"]').val('').focus();
        $.alert({ text: '手机号错误！', status: 2, timeout: 2000 });
      }
    }
  });
  $reviseMobile.IUI('ajaxForm', {
    success: function success(res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 3,
          callback: function callback() {
            window.location.href = '';
          }
        });
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 2,
          timeout: 2000
        });
      }
    }
  });

  var createRevisePassword = $('#layer-user-password').IUI('layer', { offsetWidth: 700 });
  var checkOldPass = $('#layer-check-user-pass').IUI('layer', { offsetWidth: 700 });
  var $resetPass = $('.reset-password');
  var $sendPassCode = $('#reset-pass-code');
  var $verifyCodeByUpdatePass = $('.form-verifyCodeByUpdatePass');
  var $formSetPass = $('.form-advise-password');
  $resetPass.on('click', function () {
    checkOldPass.showLayer();
  });
  $sendPassCode.on('click', sendCode);
  $verifyCodeByUpdatePass.IUI('ajaxForm', {
    success: function success(res) {
      $verifyCodeByUpdatePass[0].reset();
      if (res.code === 200) {
        checkOldPass.hideLayer();
        createRevisePassword.showLayer();
        $.alert({ text: '验证码正确！', status: 3, timeout: 2000 });
      } else {
        $.alert({ text: '验证码错误！', status: 2, timeout: 2000 });
      }
    }
  });

  $formSetPass.IUI('ajaxForm', {
    success: function success(res) {
      if (res.code === 200) {
        $.alert({
          text: '修改成功！',
          status: 3,
          timeout: 2000,
          callback: function callback() {
            window.location.href = '';
          }
        });
      } else {
        $.alert({ text: res.msg[0].value, status: 2, timeout: 2000 });
      }
    }
  });
};

/***/ }),

/***/ 394:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  // 分页器组件
  var Pagination = __webpack_require__(214);
  if ($('#feedback-container').length) {
    var $form = $('#form-keyword');
    var pagination = new Pagination($form, {
      data: paginationDate.data,
      url: window.location.href
    }).init($('#pagination-context'));
    var $tableKeyword = $('#table-keyword');
    $('#pagination-context').html(pagination);
    $tableKeyword.on('click', '.c-table-btn-sort', function (event) {
      $('[name="sortType"]').val($(this).attr('data-sortType'));
      $('[name="order"]').val($(this).hasClass('desc') ? 1 : 0);
      $form.submit();
    });
    $form.on('submit', function (event) {
      event.preventDefault();
      window.location.href = '/user/feedback?' + $form.serialize();
    });
  }
};

/***/ })

/******/ });