/**
 * validate 组件
 *
 * *** options ***
 *
 * @param {Element selector}             globalMessage       全局提示id，若为false，则逐项提示
 * @param {Element selector}             errorClass          验证信息 - 错误 class
 * @param {Element selector}             infoClass           验证信息 - 提示 class  若为false，则无info提示
 * @param {Element selector}             successClass        验证信息 - 成功 class  若为false，则无info提示
 * @param {Array}                        collections         验证规则配置
 * @param {Object}                       strategy            新增验证规则
 *
 *
 * collections 语法：[{验证项},{验证项},{验证项},{验证项}]
 *
 * 验证项 语法：
 *
    {
        required: 'password',                                 // 对应 input[data-required]
        context: '.form-group',                               // data-required的执行上下文
        infoMsg: '请输入您的密码，字符长度为3-16位',             // 提示信息
        matches: {                                           // 组合验证
            isNonEmpty: {                                    // 对应 strategy 中存在的验证方法
                errMsg: '密码不能为空'                        //  验证错误的返回信息
            },
            between: {
                errMsg: '密码长度为6-16位',
                range:[6,16]                                //可自定义字段
            }
        }
    }

 *
 *
 * *** events ***
 *
 * $('any element').on('validate.focus',function(event,matches){});
 *
 * $('any element').on('validate.blur',function(event,matches){});
 *
 *
 *
 * *** methods ***
 *
 *  batch           详情请查阅源码部分
 *  message         详情请查阅源码部分
 *  verify          详情请查阅源码部分
 *
 */
/**
 *
 * GLOB_STRATEGY    默认验证策略集合
 *
 */
var GLOB_STRATEGY = {
  isNonEmpty : function () {
    var $target = this.self
    var value = $target[0].value
    if ($.trim(value).length === 0) {
      return false
    }
  },
  minLength : function (params) {
    // 大于
    if (this.self[0].value.length < params.minLength) {
      return false
    }
  },
  maxLength : function (params) {
    // 小于
    if (this.self[0].value.length > params.maxLength) {
      return false
    }
  },
  birthdayRange : function (params) {
    // 生日范围
    var val = this.self[0].value
    var min = params.range[0]
    var max = params.range[1]
    if (val < min || val > max) {
      return false
    }
  },
  isBirthday : function () {
    // 是否为生日
    if (!/^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
      return false
    }
  },
  isMobile : function () {
    // 是否为手机号码
    if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.self[0].value)) {
      return false
    }
  },
  isEmail : function () {
    // 是否为邮箱
    if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
      return false
    }
  },
  between : function (params) {
    var length = this.self[0].value.length
    var min = params.range[0]
    var max = params.range[1]
    if (length < min || length > max) {
      return false
    }
  },
  // 纯英文
  onlyEn : function () {
    if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
      return false
    }
  },
  // 纯中文
  onlyZh : function () {
    if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
      return false
    }
  },
  // 非整数
  notInt : function () {
    if (/^[0-9]*$/.test(this.self[0].value)) {
      return false
    }
  },
  // 数字包含小数
  onlyNum : function () {
    if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
      return false
    }
  },
  // 整数
  onlyInt : function () {
    if (!/^[0-9]*$/.test(this.self[0].value)) {
      return false
    }
  },
  // 至少选中一项 radio || checkbox
  isChecked : function () {
    var result = void (0)
    this.self.each(function (index, el) {
      result = el.checked
      return !result
    })
    return result ? void (0) : false
  },
  // 昵称
  isNickname : function () {
    if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
      return false
    }
  },
  isUrl : function () {
    var $target = this.self
    var value = $.trim($target[0].value)
    if (!/^((https|http)?:\/\/)[^\s]+/.test(value)) {
      return false
    }
  },
  strictLength : function (params) {
    if (this.self[0].value.replace(/[^\x00-\xff]/g, '01').length > params.max) {
      return false
    }
  }
}

var defaults = {
  globalMessage : false,
  errorClass    : '.validate-error',
  infoClass     : '.validate-info',
  successClass  : '.validate-success',
  collections   : [],
  strategy      : GLOB_STRATEGY
}

var statusArr = ['info', 'success', 'error']

/**
 * handler 生成事件代理对象
 * @return {String}     事件委托目标
 */
function handler() {
  var queue = []
  var collections = this.cache
  for (var name in collections) {
    queue.push('[data-required=' + name + ']')
  }
  return queue
}

function focusEmitter(event) {
  var self = event.data.self
  var $this = $(this)
  var _name = $this.data('required')
  var collections = self.cache[_name]
  if (self.options.infoClass) {
    self.message(0, collections)
  }
  $this.trigger('validate.focus', collections)
}

function blurEmitter(event) {
  var _this = this
  var $this = $(this)
  var _self = event.data.self
  var requiredName = $this.data('required')
  var config = _self.cache[requiredName]
  var delay = config.options.delay
  if (delay) {
    clearTimeout($this.data('delay'))
    $this.data('delay', setTimeout(function () {
      _self.verify.call(_this, _self, 'blur')
    }, delay))
    return false
  }

  _self.verify.call(this, _self, 'blur')
}

function changeEmitter(event) {
  var _this = event.data.self
  var requiredName = $(this).attr('data-required')
  _this.cache[requiredName].self.data('validateStatus', 0)
  _this.verify.call(this, _this, 'change')
}

function inputEmitter() {
  $(this).data('validateStatus', 0)
}

function Validate(options, selector) {
  this.container = 'body'
  this.options = $.extend(true, {}, defaults, options)
  this.$selector = selector
  this.cache = {}
  this.errors = {}
  this.init()
}

/**
 * init方法     初始化
 */
Validate.prototype.init = function () {
  var _this = this

  if (_this.options.collections.length === 0) {
    return false
  }

  _this.add()

  $.each(_this.cache, function (name, fields) {
    if (fields.context.length === 0) {
      return
    }
    var contextClassName = /validate-context-(info|success|error)/.exec(fields.context[0].className)
    var initStatus
    if (contextClassName) {
      initStatus = contextClassName[1]
      fields.self.data('validateStatus', $.inArray(initStatus, statusArr))
    }
  })
}

/**
 * mapping方法      参数修正，将传入进来的数据转化另一种格式，并插入到cache中
 * @param {Object} options      每一项需要验证的配置参数
 *
 */
Validate.prototype.mapping = function (options) {
  var $dom = this.$selector.find('[data-required=' + options.required + ']')
  var $context = $dom.parents(options.context).eq(0)
  var msg
  if ($context.length === 0) {
    msg = '{context:' + options.context + '} is invalid , it may prevent the triggering event'
    if (window.console) {
      console.warn(msg)
    } else {
      throw msg
    }
  }

  // 防止重复
  if (this.cache[options.required]) {
    return false
  }

  $.extend(true, this.cache, (function () {
    var item = {}
    item[options.required] = {
      matches : {},
      self    : $dom,
      context : $context,
      infoMsg : options.infoMsg || '',
      options : options
    }
    $.extend(true, item[options.required].matches, options.matches)
    return item
  }()))
}

/**
 * remove方法                  传入 data-required 的值，删除对应的验证
 * @param {String}  target     data-required值
 *
 */
Validate.prototype.remove = function (target) {
  var _this = this
  var cache = _this.cache
  var queue, name, src, requiredName, type, $target

  if (typeof target !== 'string') {
    return false
  }

  queue = target.split(' ')

  for (name in cache) {
    src = cache[name].self
    requiredName = src.data('required')
    type = src[0] ? src[0].type : ''
    $target = _this.$selector.find('[data-required=' + requiredName + ']')

    if ($.inArray(requiredName, queue) !== -1) {
      if ($.inArray(type, ['checkbox', 'file', 'radio']) !== -1) {
        $target.off('change.iui-validate')
      } else {
        $target.off('focus.iui-validate blur.iui-validate')
      }
      $target.data('event.iui-validate', false)
      delete cache[name]
    }
  }

  _this.bindEvent()
}

Validate.prototype.add = function (options) {
  var i = 0
  var _this = this
  var collections = options || _this.options.collections
  var target, msg

  for (; i < collections.length; i++) {
    target = _this.$selector.find('[data-required="' + collections[i].required + '"]')
    msg = 'iui-validate:cannot find element by data-required="' + collections[i].required + '"'

    if (target.length) {
      _this.mapping(collections[i])
      target.data('validateStatus', 0)
    } else {
      if (window.console) {
        console.warn(msg)
      } else {
        throw msg
      }
    }
  }

  if (options) {
    $.merge(_this.options.collections, options)
  }

  _this.bindEvent()
}

/**
 * bindEvent     行为方法，如：focus、blur、change
 */
Validate.prototype.bindEvent = function () {
  var _this = this
  var handleArr = handler.call(this)
  var $selector = _this.$selector
  var changeHandleArr = ['select-one', 'select-multiple', 'radio', 'checkbox', 'file']

  $.each(handleArr, function (key, value) {
    var $target = $selector.find(value)
    var type, requiredName

    if ($target[0] === void 0) {
      return
    }

    type = $target[0].type

    requiredName = value.replace(/\[data\-required\=(.+)\]/g, '$1')

    if ($target.data('event.iui-validate')) {
      return
    }

    if ($.inArray(type, changeHandleArr) !== -1) {
      $target.on('change.iui-validate', {
        self : _this
      }, changeEmitter)
      $target.data('event.iui-validate', true)
      return
    }

    $target.on('input propertychange', {
      self : _this
    }, inputEmitter)
    $target.on('focus.iui-validate', {
      self : _this
    }, focusEmitter)

    if (_this.cache[requiredName].options.unblur !== true) {
      $target.on('blur.iui-validate', {
        self : _this
      }, blurEmitter)
    }

    $target.data('event.iui-validate', true)
  })
}

/**
 * verify  行为触发验证
 * @param  {Object} glob      全局对象 Validate
 * @param  {String} eventName 事件名
 */
Validate.prototype.verify = function (glob, eventName) {
  var $this = $(this)
  var collections = glob.cache[$this.data('required')]
  var matches = collections.matches
  var status = false
  /**
     * @param {String}      name        验证函数名
     * @param {Object}      params      验证字段（自定义字段）：errMsg、range
     */
  $.each(matches, function (name, params) {
    var result = glob.options.strategy[name].call(collections, params)
    status = result === void (0) ? 1 : 2
    $this.data('validateStatus', status)
    glob.message(status, collections, name)
    return status !== 2
  })

  $this.trigger('validate.' + eventName, collections)

  return status
}

/**
 * [message description]
 * @param  {Number} status      验证状态：0 未验证状态，1 验证且通过，2 验证且不通过
 * @param  {Object} options     被转化后的验证参数
 * @param  {String} matchesName 验证函数名
 *
 */
Validate.prototype.message = function (status, cache, matchesName) {
  var className, contextClass, msg, $target, $msgEl, errors = this.errors

  if (status === 0) {
    className = this.options.infoClass
    msg = cache.infoMsg
  } else if (status === 1) {
    className = this.options.successClass
    msg = ''
  } else if (status === 2) {
    className = this.options.errorClass
    msg = cache.matches[matchesName].errMsg
  } else {
    // 后期再考虑 status === anything ...
  }

  errors[cache.options.required] = status === 2 ? msg : ''

  if (!this.options.errorClass) {
    return false
  }
  contextClass = ['info', 'success', 'error']
  $msgEl = this.options.globalMessage ? $(this.options.globalMessage) : cache.context
  className = className.replace(/\./g, ' ').slice(1)
  $msgEl.removeClass('validate-context-info validate-context-success validate-context-error')
    .addClass('validate-context-' + contextClass[status]).find('.validate-message').remove()
  $target = $('<div class="validate-message ' + className + '" >' + msg + '</div>')
  $msgEl.append($target)
}

/**
 * batch    批量验证
 * @param  {Boolean}            circulation       强制循环，true：将全部验证，false：其中一个验证不通过将返回false并中断循环
 * @return {Boolean}
 *
 */
Validate.prototype.batch = function (circulation, requiredArr) {
  var _this = this
  var status = []
  $.each(this.cache, function (name, target) {
    var result, partValidResult

    if (requiredArr && Object.prototype.toString.call(requiredArr) === '[object Array]') {
      $.each(requiredArr, function (index, value) {
        if (name === value) {
          partValidResult = true
        }
      })
    }

    if (target.self[0].disabled || (requiredArr && partValidResult === void 0)) {
      return
    }

    result = _this.verify.call(target.self, _this, 'batch')

    if (circulation && result === 2) {
      status.push(result)
      return false
    }

    status.push(result)
  })
  return $.inArray(2, status) === -1
}

Validate.prototype.changeStatus = function (target, code, text) {
  var _this = this
  var _code = typeof (code) === 'number' && code < 3 && code > -1 ? code : 0
  var $target = _this.$selector.find('[data-required="' + (target || '') + '"]')
  var stubData = $.extend(true, {}, _this.cache[target], {
    matches : {
      customer : {
        errMsg : text || ''
      }
    }
  })
  if ($target.length === 0) {
    return `can not found "${target}" in the form`
  }
  $target.data('validateStatus', _code)
  _this.message(code, stubData, 'customer')
}

module.exports = {
  validate : function (options) {
    return new Validate(options, this)
  }
}
