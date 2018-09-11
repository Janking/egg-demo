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
/******/ 	return __webpack_require__(__webpack_require__.s = 484);
/******/ })
/************************************************************************/
/******/ ({

/***/ 484:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $startTime = $('#datepicker-start');
var $endTime = $('#datepicker-end');
var $today = $('.today');
var today = $today.attr('data-time');
var $dates = $('.J-dates-context');
var start = $startTime.val() ? new Date($startTime.val()) : new Date();
start.setHours(0);
start.setMinutes(0);
var end = $endTime.val() ? new Date($endTime.val()) : new Date();
end.setHours(0);
end.setMinutes(0);
$startTime.datepicker({
    timepicker: false,
    dateFormat: 'yyyy-mm-dd',
    startDate: start,
    onSelect: function onSelect(date, datetime, datepicker) {
        // datepicker.$el.val(date + ':00');
        if (date + ':00' == today && $('[data-time="' + $endTime.val() + '"]').length) {
            $('[data-time="' + $endTime.val() + '"]').trigger('click');
        } else {
            $dates.find('a').addClass('btn-default').removeClass('btn-primary');
        }
    }
});

$endTime.datepicker({
    timepicker: false,
    dateFormat: 'yyyy-mm-dd',
    startDate: end,
    onSelect: function onSelect(date, datetime, datepicker) {
        // datepicker.$el.val(date + ':00');
        if ($startTime.val() == today && $('[data-time="' + $endTime.val() + '"]').length) {
            $('[data-time="' + $endTime.val() + '"]').trigger('click');
        } else {
            $dates.find('a').addClass('btn-default').removeClass('btn-primary');
        }
    }
});

if ($startTime.val()) {
    $startTime.val($startTime.val().split(' ')[0]);
    $endTime.val($endTime.val().split(' ')[0]);
} else {
    $startTime.val(today.split(' ')[0]);
    $endTime.val(today.split(' ')[0]);
}

$dates.on('click', 'a', function (event) {
    event.preventDefault();
    var $this = $(this);
    $this.removeClass('btn-default').addClass('btn-primary').siblings('.btn-primary').removeClass('btn-primary').addClass('btn-default');

    if ($this.attr('data-key') == '近7天' || $this.attr('data-key') == '近一月') {
        $startTime.val($this.attr('data-time').split(' ')[0]);
        $endTime.val(today.split(' ')[0]);
    } else {
        $startTime.val($this.attr('data-time').split(' ')[0]);
        $endTime.val($this.attr('data-time').split(' ')[0]);
    }
});

$('[name="isAll"]').on('change', function (event) {
    $('[type="checkbox"]').prop('checked', this.checked);
});

$('.form-download').IUI('ajaxForm', {
    success: function success(res) {
        if (!res.flag) {
            $.alert({
                text: res.msg
            });
        } else {
            window.location.href = '/report/download/detail?comId=' + COMID + '&downloadId=' + res.data;
        }
    }
});

/***/ })

/******/ });