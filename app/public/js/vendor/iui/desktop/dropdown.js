/**
 * dropdown 组件
 * @param      {boolean}    readOnly        为true的时候，其他所有option失效
 * @param      {number}     limitCount      限制选择个数，默认 Infinity
 * @param      {string}     input           搜索的 input
 * @param      {array}      data            默认 []
 */
let utils = require('../utils')

let isSafari = (function () {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('safari') !== -1) {
    return ua.indexOf('chrome') > -1
  }
})()

function noop() { }

let settings = {
  readonly     : false,
  limitCount   : Infinity,
  input        : '<input type="text" maxLength="20" placeholder="搜索关键词或ID">',
  data         : [],
  searchable   : true,
  searchNoData : '<li style="color:#ddd;padding: 0 10px;text-align: center;">查无数据，换个词儿试试 /(ㄒoㄒ)/~~</li>',
  init         : noop,
  choice       : noop,
  extendProps  : []
}

let KEY_CODE = {
  up    : 38,
  down  : 40,
  enter : 13
}

let EVENT_SPACE = {
  click   : 'click.iui-dropdown',
  focus   : 'focus.iui-dropdown',
  keydown : 'keydown.iui-dropdown',
  keyup   : 'keyup.iui-dropdown'
}

// 创建模板
function createTemplate() {
  let isLabelMode = this.isLabelMode
  let searchable = this.config.searchable
  let templateSearch = searchable ? `<span class="dropdown-search">${this.config.input}</span>` : ''

  return isLabelMode ? `<div class="dropdown-display-label"><div class="dropdown-chose-list">${templateSearch}</div></div><div class="dropdown-main">{{ul}}</div>` : `<a href="javascript:;" class="dropdown-display"><span class="dropdown-chose-list"></span></a><div class="dropdown-main">${templateSearch}{{ul}}</div>`
}

// 超出限制提示
function maxItemAlert() {
  let _dropdown = this
  let _config = _dropdown.config
  let $el = _dropdown.$el
  let $alert = $el.find('.dropdown-maxItem-alert')
  clearTimeout(_dropdown.maxItemAlertTimer)

  if ($alert.length === 0) {
    $alert = $(`<div class="dropdown-maxItem-alert">最多可选择${_config.limitCount}个</div>`)
  }

  $el.append($alert)
  _dropdown.maxItemAlertTimer = setTimeout(function () {
    $el.find('.dropdown-maxItem-alert').remove()
  }, 1000)
}

// select-option 转 ul-li
function selectToDiv(str) {
  let result = str || ''
  // 移除select标签
  result = result.replace(/<select[^>]*>/gi, '').replace('</select>', '')
  // 移除 optgroup 结束标签
  result = result.replace(/<\/optgroup>/gi, '')
  result = result.replace(/<optgroup[^>]*>/gi, function (matcher) {
    let groupName = /label="(.[^"]*)"(\s|>)/.exec(matcher)
    let groupId = /data-group-id="(.[^"]*)"(\s|>)/.exec(matcher)
    return '<li class="dropdown-group" data-group-id="' + (groupId ? groupId[1] : '') + '">' + (groupName ? groupName[1] : '') + '</li>'
  })
  result = result.replace(/<option(.*?)<\/option>/gi, function (matcher) {
    let value = /value="?([\w\u4E00-\u9FA5\uF900-\uFA2D]+)"?/.exec(matcher)
    let name = />(.*)<\//.exec(matcher)
    // 强制要求html中使用selected/disabled，而不是selected="selected","disabled="disabled"
    let isSelected = matcher.indexOf('selected') > -1
    let isDisabled = matcher.indexOf('disabled') > -1
    let extendAttr = ''
    // var extendProps = matcher.replace(/data-(\w+)="?(.[^"]+)"?/g, function ($1) {
    //   extendAttr += $1 + ' '
    // })
    return '<li ' + (isDisabled ? ' disabled' : ' tabindex="0"') + ' data-value="' + (value ? value[1] : '') + '" class="dropdown-option ' + (isSelected ? 'dropdown-chose' : '') + '" ' + extendAttr + '>' + (name ? name[1] : '') + '</li>'
  })

  return result
}

// object-data 转 select-option
function objectToSelect(data) {
  var dropdown = this
  var map = {}
  var result = ''
  var name = []
  var selectAmount = 0
  var extendProps = dropdown.config.extendProps

  if (!data || !data.length) {
    return false
  }

  $.each(data, function (index, val) {
    // disable 权重高于 selected
    var hasGroup = val.groupId
    var isDisabled = val.disabled ? ' disabled' : ''
    var isSelected = val.selected && !isDisabled ? ' selected' : ''
    var extendAttr = ''
    $.each(extendProps, function (index, value) {
      if (val[value]) {
        extendAttr += 'data-' + value + '="' + val[value] + '" '
      }
    })
    var temp = '<option' + isDisabled + isSelected + ' value="' + val.id + '" ' + extendAttr + '>' + val.name + '</option>'
    if (isSelected) {
      name.push('<span class="dropdown-selected">' + val.name + '<i class="del" data-id="' + val.id + '"></i></span>')
      selectAmount++
    }
    // 判断是否有分组
    if (hasGroup) {
      if (map[val.groupId]) {
        map[val.groupId] += temp
      } else {
        //  &janking& just a separator
        map[val.groupId] = val.groupName + '&janking&' + temp
      }
    } else {
      map[index] = temp
    }
  })

  $.each(map, function (index, val) {
    var option = val.split('&janking&')
    // 判断是否有分组
    if (option.length === 2) {
      var groupName = option[0]
      var items = option[1]
      result += '<optgroup label="' + groupName + '" data-group-id="' + index + '">' + items + '</optgroup>'
    } else {
      result += val
    }
  })

  return [result, name, selectAmount]
}

// select-option 转 object-data
//
function selectToObject(el) {
  var $select = el
  var result = []

  function readOption(key, el) {
    var $option = $(el)
    this.id = $option.prop('value')
    this.name = $option.text()
    this.disabled = $option.prop('disabled')
    this.selected = $option.prop('selected')
  }

  $.each($select.children(), function (key, el) {
    var tmp = {}
    var tmpGroup = {}
    var $el = $(el)
    if (el.nodeName === 'OPTGROUP') {
      tmpGroup.groupId = $el.data('groupId')
      tmpGroup.groupName = $el.attr('label')
      $.each($el.children(), $.proxy(readOption, tmp))
      $.extend(tmp, tmpGroup)
    } else {
      $.each($el, $.proxy(readOption, tmp))
    }
    result.push(tmp)
  })

  return result
}

let action = {
  show : function (event) {
    event.stopPropagation()
    let _dropdown = this
    $(document).trigger('click.dropdown')
    _dropdown.$el.addClass('active')
    // $main.find('input').focus();
  },
  search : utils.throttle(function (event) {
    let _dropdown = this
    let _config = _dropdown.config
    let $el = _dropdown.$el
    let $input = $(event.target)
    let intputValue = $input.val()
    let data = _dropdown.config.data
    let result = []
    if (event.keyCode > 36 && event.keyCode < 41) {
      return
    }
    $.each(data, function (key, value) {
      if (value.name.toLowerCase().indexOf(intputValue.toLowerCase()) > -1 || '' + value.id === '' + intputValue) {
        result.push(value)
      }
    })
    $el.find('ul').html(selectToDiv(objectToSelect.call(_dropdown, result)[0]) || _config.searchNoData)
  }, 300),
  control : function (event) {
    let keyCode = event.keyCode
    let KC = KEY_CODE
    let index = 0
    let direct
    let itemIndex
    let $items
    if (keyCode === KC.down || keyCode === KC.up) {
      // 方向
      direct = keyCode === KC.up ? -1 : 1
      $items = this.$el.find('[tabindex]')
      itemIndex = $items.index($(document.activeElement))
      // 初始
      if (itemIndex === -1) {
        index = direct + 1 ? -1 : 0
      } else {
        index = itemIndex
      }
      // 确认位序
      index = index + direct
      // 最后位循环
      if (index === $items.length) {
        index = 0
      }
      $items.eq(index).focus()
      event.preventDefault()
    }
  },
  multiChoose : function (event) {
    let _dropdown = this
    let _config = _dropdown.config
    let $select = _dropdown.$select
    let $target = $(event.target)
    let value = $target.attr('data-value')
    let hasSelected = $target.hasClass('dropdown-chose')
    let selectedName = []
    let selectedProp

    if ($target.hasClass('dropdown-display')) {
      return false
    }

    if (hasSelected) {
      $target.removeClass('dropdown-chose')
      _dropdown.selectAmount--
    } else {
      if (_dropdown.selectAmount < _config.limitCount) {
        $target.addClass('dropdown-chose')
        _dropdown.selectAmount++
      } else {
        maxItemAlert.call(_dropdown)
        return false
      }
    }

    _dropdown.name = []

    $.each(_config.data, function (key, item) {
      if ('' + item.id === '' + value) {
        selectedProp = item
        item.selected = !!hasSelected
      }
      if (item.selected) {
        selectedName.push(item.name)
        _dropdown.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>')
      }
    })

    $select.find('option[value="' + value + '"]').prop('selected', !!hasSelected)

    _dropdown.$choseList.find('.dropdown-selected').remove()
    _dropdown.$choseList.prepend(_dropdown.name.join(''))
    _dropdown.$el.find('.dropdown-display').attr('title', selectedName.join(','))
    _config.choice.call(_dropdown, event, selectedProp)
  },
  singleChoose : function (event) {
    var _dropdown = this
    var _config = _dropdown.config
    var $el = _dropdown.$el
    var $select = _dropdown.$select
    var $target = $(event.target)
    var value = $target.attr('data-value')
    var hasSelected = $target.hasClass('dropdown-chose')

    if ($target.hasClass('dropdown-chose') || $target.hasClass('dropdown-display')) {
      return false
    }

    _dropdown.name = []

    $el.removeClass('active').find('li').not($target).removeClass('dropdown-chose')

    $target.toggleClass('dropdown-chose')
    $.each(_config.data, function (key, item) {
      // id 有可能是数字也有可能是字符串，强制全等有弊端 2017-03-20 22:19:21
      item.selected = false
      if ('' + item.id === '' + value) {
        item.selected = hasSelected ? 0 : 1
        if (item.selected) {
          _dropdown.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>')
        }
      }
    })

    $select.find('option[value="' + value + '"]').prop('selected', true)

    _dropdown.name.push('<span class="placeholder">' + _dropdown.placeholder + '</span>')
    _dropdown.$choseList.html(_dropdown.name.join(''))
    _config.choice.call(_dropdown, event)
  },
  del : function (event) {
    let _dropdown = this
    let $target = $(event.target)
    let id = $target.data('id')
    // 2017-03-23 15:58:50 测试
    // 10000条数据测试删除，耗时 ~3ms
    $.each(_dropdown.name, function (key, value) {
      if (value.indexOf('data-id="' + id + '"') !== -1) {
        _dropdown.name.splice(key, 1)
        return false
      }
    })

    $.each(_dropdown.config.data, function (key, item) {
      if ('' + item.id === '' + id) {
        item.selected = false
        return false
      }
    })

    _dropdown.selectAmount--
    _dropdown.$el.find('[data-value="' + id + '"]').removeClass('dropdown-chose')
    _dropdown.$el.find('[value="' + id + '"]').prop('selected', false).removeAttr('selected')
    $target.closest('.dropdown-selected').remove()

    return false
  },
  clearAll : function (event) {
    event.preventDefault()
    this.$choseList.find('.del').each(function (index, el) {
      $(el).trigger('click')
    })
    this.$el.find('.dropdown-display').removeAttr('title')
    return false
  }
}

function Dropdown(options, el) {
  this.$el = $(el)
  this.$select = this.$el.find('select')
  this.placeholder = this.$select.attr('placeholder')
  this.config = options
  this.name = []
  this.isSingleSelect = !this.$select.prop('multiple')
  this.selectAmount = 0
  this.maxItemAlertTimer = null
  this.isLabelMode = this.config.multipleMode === 'label'
  this.init()
}

Dropdown.prototype = {
  init : function () {
    let _this = this
    let _config = _this.config
    let $el = _this.$el
    _this.$select.hide()
    //  判断dropdown是否单选，是否token模式
    $el.addClass(_this.isSingleSelect ? 'dropdown-single' : _this.isLabelMode ? 'dropdown-multiple-label' : 'dropdown-multiple')

    if (_config.data.length === 0) {
      _config.data = selectToObject(_this.$select)
    }

    let processResult = objectToSelect.call(_this, _config.data)

    _this.name = processResult[1]
    _this.selectAmount = processResult[2]
    _this.$select.html(processResult[0])
    _this.renderSelect()
    // disabled权重高于readonly
    _this.changeStatus(_config.disabled ? 'disabled' : _config.readonly ? 'readonly' : false)

    _this.config.init()
  },

  // 渲染 select 为 dropdown
  renderSelect : function (isUpdate, isCover) {
    var _this = this
    var $el = _this.$el
    var $select = _this.$select
    var elemLi = selectToDiv($select.prop('outerHTML'))
    var template

    if (isUpdate) {
      $el.find('ul')[isCover ? 'html' : 'append'](elemLi)
    } else {
      template = createTemplate.call(_this).replace('{{ul}}', '<ul>' + elemLi + '</ul>')
      $el.append(template).find('ul').removeAttr('style class')
    }

    if (isCover) {
      _this.name = []
      _this.$el.find('.dropdown-selected').remove()
      _this.$select.val('')
    }

    _this.$choseList = $el.find('.dropdown-chose-list')

    if (!_this.isLabelMode) {
      _this.$choseList.html($('<span class="placeholder"></span>').text(_this.placeholder))
    }

    _this.$choseList.prepend(_this.name.join(''))
  },
  bindEvent : function () {
    let _this = this
    let $el = _this.$el
    let openHandle = isSafari ? EVENT_SPACE.click : EVENT_SPACE.focus

    $el.on(EVENT_SPACE.click, function (event) {
      event.stopPropagation()
    })

    $el.on(EVENT_SPACE.click, '.del', $.proxy(action.del, _this))

    // show
    if (_this.isLabelMode) {
      $el.on(EVENT_SPACE.click, '.dropdown-display-label', function () {
        $el.find('input').focus()
      })
      if (_this.config.searchable) {
        $el.on(EVENT_SPACE.focus, 'input', $.proxy(action.show, _this))
      } else {
        $el.on(EVENT_SPACE.click, $.proxy(action.show, _this))
      }
      $el.on(EVENT_SPACE.keydown, 'input', function (event) {
        if (event.keyCode === 8 && this.value === '' && _this.name.length) {
          $el.find('.del').eq(-1).trigger('click')
        }
      })
    } else {
      $el.on(openHandle, '.dropdown-display', $.proxy(action.show, _this))
      $el.on(openHandle, '.dropdown-clear-all', $.proxy(action.clearAll, _this))
    }

    // 搜索
    $el.on(EVENT_SPACE.keyup, 'input', $.proxy(action.search, _this))

    // 按下enter键设置token
    $el.on(EVENT_SPACE.keyup, function (event) {
      let keyCode = event.keyCode
      let KC = KEY_CODE
      if (keyCode === KC.enter) {
        $.proxy(_this.isSingleSelect ? action.singleChoose : action.multiChoose, _this, event)()
      }
    })

    // 按下上下键切换token
    $el.on(EVENT_SPACE.keydown, $.proxy(action.control, _this))

    $el.on(EVENT_SPACE.click, '[tabindex]', $.proxy(_this.isSingleSelect ? action.singleChoose : action.multiChoose, _this))
  },
  unbindEvent : function () {
    let _this = this
    let $el = _this.$el
    let openHandle = isSafari ? EVENT_SPACE.click : EVENT_SPACE.focus

    $el.off(EVENT_SPACE.click)
    $el.off(EVENT_SPACE.click, '.del')

    // show
    if (_this.isLabelMode) {
      $el.off(EVENT_SPACE.click, '.dropdown-display-label')
      $el.off(EVENT_SPACE.focus, 'input')
      $el.off(EVENT_SPACE.keydown, 'input')
    } else {
      $el.off(openHandle, '.dropdown-display')
      $el.off(openHandle, '.dropdown-clear-all')
    }
    // 搜索
    $el.off(EVENT_SPACE.keyup, 'input')
    // 按下enter键设置token
    $el.off(EVENT_SPACE.keyup)
    // 按下上下键切换token
    $el.off(EVENT_SPACE.keydown)
    $el.off(EVENT_SPACE.click, '[tabindex]')
  },
  changeStatus : function (status) {
    let _this = this
    if (status === 'readonly') {
      _this.unbindEvent()
    } else if (status === 'disabled') {
      _this.$select.prop('disabled', true)
      _this.unbindEvent()
    } else {
      _this.$select.prop('disabled', false)
      _this.bindEvent()
    }
  },
  update : function (data, isCover) {
    let _this = this
    let _config = _this.config
    let _isCover = isCover || false

    if (Object.prototype.toString.call(data) !== '[object Array]') {
      return
    }

    _config.data = _isCover ? data.slice(0) : _config.data.concat(data)

    let processResult = objectToSelect.call(_this, _config.data)

    _this.name = processResult[1]
    _this.selectAmount = processResult[2]
    _this.$select.html(processResult[0])
    _this.renderSelect(true, _isCover)
  },
  destroy : function () {
    this.unbindEvent()
    this.$el.children().not('select').remove()
    this.$el.removeClass('dropdown-single dropdown-multiple-label dropdown-multiple')
    this.$select.show()
  },
  choose : function (values, status) {
    let valArr = Object.prototype.toString.call(values) === '[object Array]' ? values : [values]
    let _this = this
    let _status = status !== void 0 ? !!status : true
    $.each(valArr, function (index, value) {
      let $target = _this.$el.find('[data-value="' + value + '"]')
      let targetStatus = $target.hasClass('dropdown-chose')
      if (targetStatus !== _status) {
        $target.trigger(EVENT_SPACE.click, status || true)
      }
    })
  }
}

$(document).on('click.dropdown', function () {
  $('.dropdown-single,.dropdown-multiple,.dropdown-multiple-label').removeClass('active')
})

module.exports = {
  dropdown : function (options) {
    this.each(function (index, el) {
      $(el).data('iui-dropdown', new Dropdown($.extend(true, {}, settings, options), el))
    })
  }
}
