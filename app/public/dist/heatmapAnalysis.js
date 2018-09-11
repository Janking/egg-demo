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
/******/ 	return __webpack_require__(__webpack_require__.s = 498);
/******/ })
/************************************************************************/
/******/ ({

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


{
  /**
   * 添加热力图
   */
  var groupHotmap = function groupHotmap(data, target) {
    var _data = data || {
      title: '新建热力图',
      Src: '/report/click/add',
      msg: '创建成功',
      comId: COMID
    };
    var creatHotmapLayer = $('#layer-createHotmap').IUI('layer', {
      content: template.compile($('#tpl-createHotmap').html())(_data),
      dynamic: true,
      offsetWidth: 800
    });

    creatHotmapLayer.showLayer();

    var createHotmapValidate = $('.form-creatHotmap').IUI('validate', {
      strategy: {
        httpReg: function httpReg() {
          var $target = this.self;
          var value = $.trim($target[0].value);
          if (!/^((https|http)?:\/\/)[^\s]+/.test(value)) {
            return false;
          }
        }
      },
      collections: [{
        required: 'heatmapName',
        context: '.col-10',
        matches: {
          isNonEmpty: {
            errMsg: '热力图名称不能为空'
          }
        }
      }, {
        required: 'url',
        context: '.col-10',
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

    $('.form-creatHotmap').IUI('ajaxForm', {
      before: function before() {
        if (createHotmapValidate.batch() === false) {
          return false;
        }
      },
      success: function success(res) {
        if (res.code == 200) {
          $.alert({
            text: '修改成功',
            status: 0,
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
  };

  // 移除分组


  var $body = $('body');
  /**
   * 申请热力图热力图
   */
  $('#apply-heatmap-form').IUI('ajaxForm', {
    success: function success(res) {
      if (res.code === 200) {
        $.alert({
          text: '恭喜您申请成功~',
          status: 1,
          timeout: 3000,
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
   * 添加查询热力图
   */
  $('#form-searheatmap').IUI('ajaxForm', {
    before: function before() {
      var readSear = $('#form-searheatmap').find('input[name="name"]').val();
      if (readSear === '') {
        $.alert({
          text: '请输入页面相关信息',
          timeout: 1000,
          callback: function callback() {
            return false;
          }
        });
      }
    },
    success: function success(res) {
      if (res.code === 200) {
        window.location.href = window.location.href;
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        });
      }
    }
  });$('body').on('click', '.remove', function (event) {
    var $this = $(this);
    var groupName = $this.closest('tr').find('.name').text();
    $.dialog({
      content: '<div class="fb f20 c333 tc">确定要删除热力图“' + groupName + '”吗？</div>',
      type: 'confirm',
      closeBtn: true,
      confirm: function confirm(deferred) {
        $.post($this.attr('data-url')).then(function (res) {
          if (res.code === 200) {
            $this.closest('tr').fadeOut(300, function () {
              $(this).remove();
            });
          } else {
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

  // 更改状态
  $('body').on('click', '.status', function (event) {
    var $this = $(this);
    $.post($this.attr('data-url')).then(function (res) {
      if (res.code === 200) {
        window.location.href = window.location.href;
      } else {
        $.alert({
          text: res.msg[0].value,
          status: 0
        });
      }
    });
  });

  $('.btn-createHotmap').on('click', function (event) {
    groupHotmap();
  });
  // 修改分组
  $('body').on('click', '.update', function () {
    var $this = $(this);
    var data = $this.closest('tr').find('input[name="store"]').val();
    var $tr = $this.closest('tr');
    groupHotmap($.extend({
      title: '编辑热力图',
      Src: '/report/click/update',
      msg: '修改成功！'
    }, $.parseJSON(data)), $tr);
  });
}
// 热力图页面
{
  if ($('body').find('.heatmap-view').length) {
    // 实例化时间
    var heatmapStart = '';
    var heatmapStop = '';
    $('#datepicker-range').datepicker({
      dateFormat: 'yyyy-mm-dd',
      maxDate: new Date(),
      onSelect: function onSelect(date, datetime, datepicker) {
        heatmapStart = date.split(' - ')[0];
        heatmapStop = date.split(' - ')[1];
      },
      onHide: function onHide(inst, animationCompleted) {
        if ($('.heatmap-mainer-nav a.active').attr('role') == 'heatmap') {
          location.href = '/report/heatmap/point?comId=' + COMID + '&start=' + heatmapStart + '&stop=' + heatmapStop + '&urlId=' + queryData.urlId + '&url=' + queryData.url + '&isPc=' + queryData.isPc;
        } else {
          location.href = '/report/heatmap/click?comId=' + COMID + '&start=' + heatmapStart + '&stop=' + heatmapStop + '&urlId=' + queryData.urlId + '&url=' + queryData.url + '&isPc=' + queryData.isPc;
        }
      }
    });

    // 创建发送数据对象
    $.sub('getSuccess', function (event, res) {
      window.frames[0].postMessage(JSON.stringify({
        type: $('.heatmap-mainer-nav a.active').attr('role'),
        data: res.data
      }), res.data.url);
    });

    // 发送数据实例化
    window.onload = function () {
      $.pub('getSuccess', resultData);
    };
  }
}

/***/ })

/******/ });