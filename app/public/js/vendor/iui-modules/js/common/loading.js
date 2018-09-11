import $ from 'jquery'
function createTemplate(config, isGlobal) {
  // loading 模板
  var loadingStr = config.template

  // 是否需要遮罩
  loadingStr += config.shadow ? '<div class="LAIUI-loading-backdrop" ' + (isGlobal ? 'style="position:absolute;"' : '') + '></div>' : ''
  loadingStr = loadingStr.replace('{{hook}}', config.type ? config.animateHtml : '<img src="' + config.src + '" />')

  return loadingStr
}

function Loading(options, type) {
  // 默认配置
  var defaults = {
    display     : false,
    type        : true,
    shadow      : true,
    animateHtml : '<div class="ball-clip-rotate"><div></div></div>',
    src         : 'http://img.yi114.com/201571121314_382.gif',
    template    : '<div class="LAIUI-loading">{{hook}}</div>'
  }

  // 判断是临时配置还是自定义配置
  var isTempConfig = typeof options === 'object'
  // 是否全局模式
  var isGlobal = this instanceof $
  // 作用域元素
  var $context = $('body')

  $.extend(defaults, isTempConfig ? options : {})

  // 若非全局模式，给作用域元素相对定位
  if (isGlobal) {
    $context = this
    $context.css('position', 'relative')
  }

  // 快捷切换css3 or image
  if (type !== undefined) {
    defaults.type = type
  }

  // 若options不为配置对象
  if (!isTempConfig && typeof options !== 'undefined') {
    defaults.display = options
  }

  var $loading = $(createTemplate(defaults, isGlobal))

  // 显示 or 隐藏
  if (defaults.display) {
    $context.data('loading', $loading).append($loading)
  } else {
    $context.data('loading').remove()
  }
}

$.fn.loading = Loading

export default { loading: Loading }
