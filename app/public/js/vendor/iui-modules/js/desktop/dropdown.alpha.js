
import helpers from '../helpers'

let isSafari = (function () {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('safari') !== -1) {
    return !(ua.indexOf('chrome') > -1)
  }
})()
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
// object-data 转 select-option
function objectToSelect(data) {
  let map = {}
  let result = ''
  let name = []
  let selectAmount = 0

  if (!data || !data.length) {
    return false
  }

  helpers.each(data, function (index, val) {
    // disable 权重高于 selected
    let hasGroup = val.groupId
    let isDisabled = val.disabled ? ' disabled' : ''
    let isSelected = val.selected && !isDisabled ? ' selected' : ''

    let temp = `<option${isDisabled}${isSelected} value="${val.id}">${val.name}</option>`

    if (isSelected) {
      name.push(`<span class="dropdown-selected">${val.name}<i class="del" data-id="${val.id}"></i></span>`)
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

  helpers.each(map, function (index, val) {
    let option = val.split('&janking&')
    // 判断是否有分组
    if (option.length === 2) {
      let groupName = option[0]
      let items = option[1]
      result += `<optgroup label="${groupName}" data-group-id="${index}">${items}</optgroup>`
    } else {
      result += val
    }
  })

  return [result, name, selectAmount]
}

// select-option 转 object-data
function selectToObject(el) {
  let selectElem = el
  let result = []

  function readOption(key, el) {
    let $option = $(el)

    this.id = $option.prop('value')
    this.name = $option.text()
    this.disabled = $option.prop('disabled')
    this.selected = $option.prop('selected')
  }
  helpers.each(helpers.children(selectElem), function (key, el) {
    let tmp = {}
    let tmpGroup = {}
    let $el = $(el)

    if (el.nodeName === 'OPTGROUP') {
      tmpGroup.groupId = el.getAttribute('group-id')
      tmpGroup.groupName = el.getAttribute('label')
      $.each($el.children(), $.proxy(readOption, tmp))
      $.extend(tmp, tmpGroup)
    } else {
      $.each($el, $.proxy(readOption, tmp))
    }

    result.push(tmp)
  })

  return result
}

// 创建模板
function createTemplate() {
  let isLabelMode = this.isLabelMode
  let searchable = this.config.searchable
  let templateSearch = searchable ? `<span class="dropdown-search">${this.config.input}</span>` : ''

  return isLabelMode
    ? `<div class="dropdown-display-label">
            <div class="dropdown-chose-list">${templateSearch}</div>
        </div><div class="dropdown-main">{{ul}}</div>`
    : `<a href="javascript:;" class="dropdown-display">
            <span class="dropdown-chose-list"></span>
            </a><div class="dropdown-main">${templateSearch}{{ul}}</div>`
}

// select-option 转 ul-li
function selectToDiv(str) {
  let result = str || ''
  // 移除select标签
  result = result.replace(/<select[^>]*>/gi, '<ul>').replace('</select', '</ul')
  // 移除 optgroup 结束标签
  result = result.replace(/<\/optgroup>/gi, '')
  result = result.replace(/<optgroup[^>]*>/gi, function (matcher) {
    let groupName = /label="(.[^"]*)"(\s|>)/.exec(matcher)
    let groupId = /data\-group\-id="(.[^"]*)"(\s|>)/.exec(matcher)
    return `<li class="dropdown-group" data-group-id="${groupId[1] || ''}">${groupName[1] || ''}</li>`
  })
  result = result.replace(/<option(.*?)<\/option>/gi, function (matcher) {
    let value = /value="(.[^"]*)"(\s|>)/.exec(matcher)
    let name = />(.*)<\//.exec(matcher)
    // 强制要求html中使用selected/disabled，而不是selected="selected","disabled="disabled"
    let isSelected = matcher.indexOf('selected') > -1
    let isDisabled = matcher.indexOf('disabled') > -1

    return `<li 
                ${isDisabled ? ' disabled' : ' tabindex="0"'}  data-value="${value[1] || ''}" 
                class="dropdown-option ${isSelected ? 'dropdown-chose' : ''}">${name[1] || ''}</li>`
  })

  return result
}

let KEY_CODE = {
  up    : 38,
  down  : 40,
  enter : 13
}

let action = {
  show : function (event) {
    event.stopPropagation()
    let _dropdown = this
    helpers.addClass(_dropdown.$el, 'active')
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
      if (value.name.toLowerCase().indexOf(intputValue) > -1 || ('' + value.id) === '' + intputValue) {
        result.push(value)
      }
    })

    $el.find('ul').html(selectToDiv(objectToSelect(result)[0]) || _config.searchNoData)
  }, 300),
  control : function (event) {
    var keyCode = event.keyCode
    var KC = KEY_CODE
    var index = 0
    var direct
    var itemIndex
    var $items
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
    let value = $target.data('value')
    let hasSelected = $target.hasClass('dropdown-chose')

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
      if (item.id === parseInt(value, 10)) {
        item.selected = !hasSelected
      }
      if (item.selected) {
        _dropdown.name.push(`<span class="dropdown-selected">${item.name}<i class="del" data-id="${item.id}"></i></span>`)
      }
    })

    $select.find('option[value="' + value + '"]').prop('selected', !hasSelected)

    _dropdown.$choseList.find('.dropdown-selected').remove()
    _dropdown.$choseList.prepend(_dropdown.name.join(''))

    _config.choice.call(_dropdown, event)
  },
  singleChoose : function (event) {
    let _dropdown = this
    let _config = _dropdown.config
    let $el = _dropdown.$el
    let $select = _dropdown.$select
    let $target = event.target
    let value = $target.getAttribute('data-value')
    let hasSelected = helpers.hasClass($target, 'dropdown-chose')

    _dropdown.name = []

    if (helpers.hasClass($target, 'dropdown-chose')) {
      return false
    }

    removeClass($el, 'active')
      .find('li').not($target).removeClass('dropdown-chose')

    $target.toggleClass('dropdown-chose')
    $.each(_config.data, function (key, item) {
      // id 有可能是数字也有可能是字符串，强制全等有弊端 2017-03-20 22:19:21
      item.selected = false
      if ('' + item.id === '' + value) {
        item.selected = hasSelected ? 0 : 1
        if (item.selected) {
          _dropdown.name.push(`<span class="dropdown-selected">${item.name}<i class="del" data-id="${item.id}"></i></span>`)
        }
      }
    })

    $select.find('option[value="' + value + '"]').prop('selected', true)

    _dropdown.name.push(`<span class="placeholder">${_dropdown.placeholder}</span>`)

    _dropdown.$choseList.html(_dropdown.name.join(''))
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
      if (item.id === id) {
        item.selected = false
        return false
      }
    })

    _dropdown.selectAmount--
    _dropdown.$el.find('[data-value="' + id + '"]').removeClass('dropdown-chose')
    // _dropdown.$el.find('[value="' + id + '"]').prop('selected', false).removeAttr('selected');
    $target.closest('.dropdown-selected').remove()

    return false
  }
}

function Dropdown(options, selector) {
  this.$el = document.querySelector(selector)
  this.$select = this.$el.querySelector('select')
  this.placeholder = this.$select.getAttribute('placeholder')
  this.config = options
  this.name = []
  this.isSingleSelect = !this.$select.multiple
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
    let openHandle = isSafari ? 'click' : 'focus'

    //  判断dropdown是否单选，是否token模式
    helpers.addClass($el, _this.isSingleSelect ? 'dropdown-single' : _this.isLabelMode ? 'dropdown-multiple-label' : 'dropdown-multiple')

    if (_config.data.length === 0) {
      _config.data = selectToObject(_this.$select)
    }

    let processResult = objectToSelect(_config.data)
    _this.name = processResult[1]
    _this.selectAmount = processResult[2]
    _this.$select.innerHTML = processResult[0]
    _this.renderSelect()

    $el.addEventListener('click', function (event) { event.stopPropagation() })

    // show
    if (_this.isLabelMode) {
      $el.querySelector('.dropdown-display-label').addEventListener('click', function (event) {
        action.show.call(_this, event)
      })

      $el.addEventListener('click', function (event) {
        if (helpers.indexOf('del', event.target.className)) {
          action.del.call(_this, event)
        }
      })

      $el.addEventListener('focus', function (event) {
        if (event.target.nodeName === 'INPUT') {
          action.show.call(_this, event)
        }
      })

      $el.addEventListener('keydown', function (event) {
        if (event.target.nodeName === 'INPUT') {
          if (event.keyCode === 8 &&
                        this.value === '' &&
                        _this.name.length
          ) {
            let delArr = $el.querySelectorAll('.del')
            event.target = delArr[delArr.length - 1]
            action.del.call(_this, event)
          }
        }
      })
    } else {
      $el.addEventListener(openHandle, function (event) {
        action.show.call(_this, event)
      })
    }

    //  // 搜索
    //  $el.on('keyup.iui-dropdown', 'input', $.proxy(action.search, _this));
    $el.addEventListener('keyup', function (event) {
      if (event.target.nodeName === 'INPUT') {
        action.search.call(_this, event)
      }
    })

    //  // 按下enter键设置token
    //  $el.on('keyup.iui-dropdown', function(event) {
    //      var keyCode = event.keyCode;
    //      var KC = KEY_CODE;
    //      if (keyCode === KC.enter) {
    //         $.proxy(_this.isSingleSelect ? action.singleChoose : action.multiChoose,_this,event)();
    //      }
    //  });

    //  // 按下上下键切换token
    //  $el.on('keydown.iui-dropdown', $.proxy(action.control,_this));

    // $el.on('click.iui-dropdown','[tabindex]', $.proxy());

    $el.addEventListener('click', function (event) {
      if (event.target.getAttribute('tabindex')) {
        (_this.isSingleSelect ? action.singleChoose : action.multiChoose).call(_this, event)
      }
    })
  },

  // 渲染 select 为 dropdown
  renderSelect : function () {
    let _this = this
    let $el = _this.$el
    let $select = _this.$select
    let template = createTemplate.call(_this).replace('{{ul}}', selectToDiv($select.outerHTML))

    $el.innerHTML = template

    helpers.removeAttr('style class')

    _this.$choseList = $el.querySelector('.dropdown-chose-list')

    if (!_this.isLabelMode) {
      _this.$choseList.innerHTML = `<span class="placeholder">${_this.placeholder}</span>`
    }

    _this.$choseList.insertAdjacentHTML('afterbegin', _this.name.join(''))
  }
}

$(function () {
  new Dropdown({
    data         : window.json1.data,
    limitCount   : 40,
    multipleMode : 'label',
    choice       : function () {
      // console.log(arguments,this);
    }
  }, '.dropdown-mul-1')
})
