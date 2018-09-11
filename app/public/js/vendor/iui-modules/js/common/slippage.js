/**
 * version 1.0.0
 * 支持垂直和水平翻转
 * 支持鼠标和手势
 * 不兼容 IE9-
 */

/**
 * next version
 * 超长内容模拟滚动
 * 可配置对象
 * 每屏内容动画控制
 */
import $ from 'jquery'
import utils from '../utils'

let defaults = {
  wrapper   : '#selector',
  mouseDrag : true,
  touchDrag : true,
  direction : 0
}

let normalStyle = {
  '-webkit-transform-origin' : 'center top 0px',
  '-webkit-transform'        : 'scale(1)',
  '-webkit-transition'       : 'none',
  'transform-origin'         : 'center top 0px',
  'transform'                : 'scale(1)',
  'transition'               : 'none'
}

function getPage(event) {
  let offset = event.originalEvent.touches ? event.originalEvent.touches[0] : event
  return [offset.pageX, offset.pageY]
}

function Slippage(options) {
  let _this = this
  _this.config = $.extend({}, defaults, options)
  _this.$el = $(_this.config.wrapper)
  statusInit.call(_this)
  statusSave.call(_this)
  this.init()
}

Slippage.prototype.init = function () {
  let _this = this
  if (_this.$el.children().length === 0) {
    return false
  }
  _this.$userItems = _this.$el.children()
  _this.itemsAmount = _this.$userItems.length
  _this.wrapItems()
  _this.$slippageItems = _this.$el.find('.slippage-item')
  _this.$slippageWrapper = _this.$el.find('.slippage-wrapper')
  _this.$slippageItems.eq(0).css(normalStyle).addClass('z-current')
  _this.$slippageItems.find('.slippage-content').scrollTop(1)
  _this.eventTypes()
  _this.gestures()
  console.log(_this)
}

function statusInit() {
  var _this = this
  _this.pageIndex = _this.prevIndex = _this.nextIndex = _this.arrow = _this.pageHeight = 0
}

function statusStart() {
  let _this = this
  let amount = _this.itemsAmount
  let prevIndex = _this.pageIndex - 1
  let nextIndex = _this.pageIndex + 1

  // _this.animateStart  = 1;
  _this.prevIndex = prevIndex < 0 ? (amount - prevIndex - 2) : prevIndex
  _this.nextIndex = nextIndex < amount ? nextIndex : 0
  _this.pageHeight = _this.$slippageItems.eq(0)[_this.config.direction ? 'outerHeight' : 'outerWidth']()
}

function statusMove(direction) {
  let _this = this
  _this.pageHeight = direction ? Math.abs(_this.pageHeight) : (_this.pageHeight > 0 ? (-_this.pageHeight) : _this.pageHeight)
  _this.animateTarget = direction ? _this.nextIndex : _this.prevIndex
}

function statusSave() {
  var _this = this
  _this.cache = {
    pageIndex  : _this.pageIndex,
    prevIndex  : _this.prevIndex,
    nextIndex  : _this.nextIndex,
    arrow      : _this.arrow,
    pageHeight : _this.pageHeight

  }
}

function statusRead() {
  var _this = this
  _this.pageIndex = _this.cache.pageIndex
  _this.prevIndex = _this.cache.prevIndex
  _this.nextIndex = _this.cache.nextIndex
  _this.arrow = _this.cache.arrow
  _this.pageHeight = _this.cache.pageHeight
}

// function statusUndo(){
//     let amount         = _this.itemsAmount;
//     let prevIndex      = _this.pageIndex + 1;
//     let nextIndex      = _this.pageIndex - 1;
//     _this.animateStart  = 0;
//     _this.prevIndex     = prevIndex < amount ? prevIndex : 0;
//     _this.nextIndex     = nextIndex < 0 ? (amount - nextIndex - 2) : nextIndex;
// }

Slippage.prototype.gestures = function () {
  let _this = this
  let transition = _this.config.direction ? 'translateY' : 'translateX'

  function swapEvents(type) {
    if (type === 'on') {
      $(document).on(_this.eventType.move, dragMove)
      $(document).on(_this.eventType.end, dragEnd)
    } else if (type === 'off') {
      $(document).off(_this.eventType.move)
      $(document).off(_this.eventType.end)
    }
  }

  function dragStart(event) {
    console.log('start')

    if (!_this.$slippageItems.hasClass('z-active')) {
      let $this = _this.$eventTarget = $(this)
      _this.mouseInit = getPage(event)[_this.config.direction]
      swapEvents('on')
      $this.css(normalStyle)
      statusStart.call(_this)
    }
  }

  function dragMove(event) {
    console.log('move')
    let arrows = getPage(event)[_this.config.direction]
    let offset = arrows - _this.mouseInit
    // let $next        = _this.$slippageItems.eq(_this.nextIndex);
    // let $prev        = _this.$slippageItems.eq(_this.prevIndex);
    let direction = arrows < _this.mouseInit
    // let $scrollEl    = _this.$eventTarget.find('.slippage-content');
    // let scrollAmount = $scrollEl.length ? $scrollEl[0].scrollHeight - $scrollEl[0].offsetHeight : 0;

    _this.$slippageItems.removeClass('z-active')
    _this.arrow = arrows
    statusMove.call(_this, direction, event)
    _this.$slippageItems.eq(_this.animateTarget).addClass('z-active')
    _this.$slippageItems
      .eq(_this.animateTarget)
      .css({
        '-webkit-transition' : 'none',
        'transition'         : 'none',
        '-webkit-transform'  : transition + '(' + (_this.pageHeight + offset) + 'px)',
        'transform'          : transition + '(' + (_this.pageHeight + offset) + 'px)'
      })
  }

  function dragEnd(event) {
    if (_this.$slippageItems.eq(_this.animateTarget).hasClass('z-active')) {
      let rollback = Math.abs(_this.arrow - _this.mouseInit) < 100
      let offsetEnd = rollback ? _this.pageHeight + 'px' : '0px'
      // let direction     = _this.arrow < _this.mouseInit;
      let $scrollEl = _this.$eventTarget.find('.slippage-content')

      if (rollback) {
        _this.pageHeight = 0
      } else {
        _this.pageIndex = _this.animateTarget
        _this.$slippageItems.eq(_this.animateTarget).addClass('z-current')
      }

      $scrollEl.scrollTop($scrollEl.length && $scrollEl[0].scrollTop ? $scrollEl[0].scrollTop - 1 : 1)

      _this.$slippageItems
        .eq(_this.animateTarget)
        .css({
          '-webkit-transition' : '-webkit-transform .4s linear',
          'transition'         : 'transform .4s linear',
          '-webkit-transform'  : transition + '(' + offsetEnd + ')',
          'transform'          : transition + '(' + offsetEnd + ')'
        })

      _this.$slippageItems
        .eq(_this.animateTarget)
        .on(utils.transitionEnd, function (event) {
          $(this).removeClass('z-active')
          if (rollback) {
            _this.$eventTarget.addClass('z-current')
          } else {
            _this.$eventTarget.removeClass('z-current')
          }
          _this.$eventTarget.css(normalStyle)
          _this.$slippageItems.eq(_this.animateTarget).off(utils.transitionEnd)
        })
      statusSave.call(_this)
    } else {
      statusRead.call(_this)
    }

    swapEvents('off')
    console.log(_this.pageIndex, _this.prevIndex, _this.nextIndex)
    console.log('end')
  }

  _this.$el.on(_this.eventType.start, '.slippage-item', dragStart)

  // _this.$el.on(_this.eventType.start, '.slippage-content', function(event) {

  //     let scrollAmount = this.scrollHeight - this.offsetHeight;

  //     if (this.scrollTop > 0 && this.scrollTop < scrollAmount) {
  //         _this.animateStart = 0;
  //         event.stopPropagation();
  //     }

  // });
}

Slippage.prototype.wrapItems = function () {
  let _this = this
  _this.$userItems.wrapAll('<div class="slippage-wrapper">').wrap('<div class="slippage-item"></div>')
  _this.$el.css('display', 'block')
}

Slippage.prototype.eventTypes = function () {
  let _this = this
  let types = ['s', 'e', 'x']
  let isMobile = navigator.userAgent.toLocaleLowerCase().indexOf('mobile') !== -1

  _this.eventType = {}

  if (isMobile) {
    types = [
      'touchstart.slippage',
      'touchmove.slippage',
      'touchend.slippage touchcancel.slippage'
    ]
  } else {
    types = [
      'mousedown.slippage',
      'mousemove.slippage',
      'mouseup.slippage'
    ]
  }

  _this.eventType.start = types[0]
  _this.eventType.move = types[1]
  _this.eventType.end = types[2]
}

export default {
  slippage : function (options) {
    return new Slippage(options)
  }
}
