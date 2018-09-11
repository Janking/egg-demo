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
/******/ 	return __webpack_require__(__webpack_require__.s = 501);
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

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 新闻页 分页实例化
var Pagination = __webpack_require__(214);
if ($('.news-lists').length) {
  var $form = $('#news-form');
  var pagination = new Pagination($form, {
    data: chartData.data,
    url: window.location.href
  }).init($('#pagination-context'));
  $('#pagination-context').html(pagination);

  $form.on('submit', function (event) {
    event.preventDefault();
    window.location.href = '/news/list?' + $form.serialize();
  });
}

var validate = $('.form-apply').IUI('validate', {
  collections: [{
    required: 'mobile',
    context: '.form-group',
    matches: {
      isNonEmpty: {
        errMsg: '手机号码不能为空'
      },
      isMobile: {
        errMsg: '手机号码格式不正确'
      }
    }
  }]
});
// 点击label统计
$('body').on('click', '.label-item', function (event) {
  var $this = $(this);
  $.post($this.attr('data-url')).then(function (res) {
    if (res.code === 200) {} else {
      $.alert({
        text: res.msg[0].value,
        status: 0
      });
    }
  });
});

// 
$('.form-apply').IUI('ajaxForm', {
  before: function before() {
    if (validate.batch() === false) {
      return false;
    }
  },
  success: function success(res) {
    $.post('/article/registerClick/add').then(function (res) {
      if (res.code === 200) {} else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        });
      }
    });
    var $mobile = $('.form-apply').find('#mobile').val();
    window.location.href = "/register?smsNum=" + $mobile;
  }
});

/***/ })

/******/ });