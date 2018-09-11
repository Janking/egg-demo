import $ from 'jquery'
var GLOB_STRATEGY = {
  isNonEmpty : function isNonEmpty() {
    var $target = this.self
    var value = $target[0].value
    if ($.trim(value).length === 0) {
      return false
    }
  },
  minLength : function minLength(params) {
    // 大于
    if (this.self[0].value.length < params.minLength) {
      return false
    }
  },
  maxLength : function maxLength(params) {
    // 小于
    if (this.self[0].value.length < params.maxLength) {
      return false
    }
  },
  birthdayRange : function birthdayRange(params) {
    // 生日范围
    var val = this.self[0].defaultValue || this.self[0].value
    // 最小值
    var vmin = params.range[0]
    var vminstr = vmin.split('-')
    var vminMonth = vminstr[1].length < 2 ? '0' + vminstr[1] : vminstr[1]
    var vminDay = vminstr[2].length < 2 ? '0' + vminstr[2] : vminstr[2]
    var min = vminstr[0] + '-' + vminMonth + '-' + vminDay
    // 最大值
    var vmax = params.range[1]
    var vmaxstr = vmax.split('-')
    var vmaxMonth = vmaxstr[1].length < 2 ? '0' + vmaxstr[1] : vmaxstr[1]
    var vmaxDay = vmaxstr[2].length < 2 ? '0' + vmaxstr[2] : vmaxstr[2]
    var max = vmaxstr[0] + '-' + vmaxMonth + '-' + vmaxDay

    if (val < min || val > max) {
      return false
    }
  },
  isBirthday : function isBirthday() {
    // 是否为生日
    if (!/^[1-9]\d{3}([-|/|.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
      return false
    }
  },
  isMobile : function isMobile() {
    // 是否为手机号码
    if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.self[0].value)) {
      return false
    }
  },
  isEmail : function isEmail() {
    // 是否为邮箱
    if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
      return false
    }
  },
  isNonorEmail : function isNonorEmail() {
    // 邮箱非必填
    if (this.self[0].value && !/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
      return false
    }
  },
  isIdcard : function isIdcard() {
    // 是否为身份证
    if (!/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9X]$/.test(this.self[0].value)) {
      return false
    }
  },
  isBlacklist : function isBlacklist() {
    // 姓名黑名单模糊匹配
    if (/先生|女士|小姐|妈|媽|娘|爹|爸|爷|婆|姨|大叔|你妹|父亲|母亲|奶奶|全家|你|您|我|她|他|它|艹|吊|肥|胖|擦|腿|蛋|嗯|啦|傻|骗|屎|尿|屁|死|粪|吗|贱|猪|猫|狗|鸡|鸭|鹅|呵|啊|急|哦|搞|嘴|哎|咯|嘿|哇|嘎|哟|吧|嘻|喔|谁|喝|错|烦|饿|的|笨|蠢|肝|假|掉|骚|哈哈|臭|逼|屌|猜|这|偷|骗|滚|肏|病|鬼|泥吗|泥妈|呢码|妮马|尼马|泥马|草泥妹|你好|粑粑|曹尼玛|草泥碟|卧槽|曹旎|曹尼|老子|劳资|煞笔|王八|什么|上帝|老母|耶稣|脑残|垃圾|麻痹|士大夫|知道|奥特曼|一坨|八嘎|片子|变态|二笔|毛泽东|周恩来|邓小平|江泽民|胡锦涛|温家宝|习近平|奥巴马|大便|小便|一二|萝莉|突然|今天|聊天|意外|保险|赠险|哈喽|快递|噩梦|填写|某人|健康|重疾|保障|养老|没有|便秘|色狼|臀部|雅蠛蝶|强情|橘子|禽兽|飞机|公交|新年好|祖宗|老婆|儿子|孙子|花千骨|方便面|广告|天才|谷歌|当然|边境|好事|女性|男性|鸡巴|工厂|么么哒|泡沫|泡面|网速|大小|春卷|超女|天使|咖啡|网上|布吉岛|结婚|支付宝|舞男|西瓜|体力|土豆|喜欢|密码|流量|脱欧|木头|兔子|真好|看见|顽石|饭|回来|电话|无敌|海洛因|回眸|压抑|裸露|举报|骚扰|等着|郁闷|见过|老天|分数线|男友|时代|在线|看下|切克闹|公司|地方|乾坤|看看|时间|二娃子|赣腻玛|几斤|老王|一样|民间|艺术|即可|观看|悟空|八戒|既怕|回家|别扭|白富美|智障|纳米|咖喱鸡|社会|哈利波特|英语|抱歉|长安|小男|小八|腊八粥|迷糊|闹彈|石头|辅导费|小鱼|丫头|岁月无声|一粒尘|隔壁|围神|叮当|能否|大锤|大神|珠宝|刺客|西方|阿凡达|含义|花儿|匿名|草包|才让|镜花|八路军|快乐|杀手|别人|犊子|浏览|好人|经济|开门红|人心|拜拜|白天|名字|真的|钻天|家里|东方明珠|把控|困觉|借口|蓝翔|哈密瓜|校花|曹腻嘛|飘荡|江湖|高个|太子|五万|泥沙比|尽力|卡路里|大米|三毛|日伲跌|冰山|规范|花蓓|动画|撒旦|痞子|胡诌|大大|鸡爪|天上|馅饼|门口|下年|伊拉克|老大|拉登|糯米|大师|规格|水电费|老汉|老公|小三|小二|娃娃|官方|鹤仙子|胆固醇|小汪|学习|旅行|芒果|冰露露|犯法|一片|冰心|孩子|羊驼|试试|黑妹|来一组图|叫你|几把|不好|学校|这么|几个|心情|阿里旺旺|待机|关键|帅哥|中国|联通|尴尬|神经|二百五|胸肌|咯个|大白鲨|大美妞|第三方|武则天|伦理片|中文姓名|好莱坞|妮玛|高压锅|尼瑪|喇叭|阿西吧|老母|给给|过去|苏打|分寸|警察|水平|吃人|倪马|少许|饭|浪人|倪跌|倪吗|妮妹|个人|苍井空|联通|尴尬|犊子|乳房|提供|铺子/g.test(this.self[0].value)) {
      return false
    }
  },
  isMobileCode : function isMobileCode(params) {
    // 短信验证码
    var $target = this.self[0].value
    if ($target.length !== params.leng || !/^[0-9]*$/.test($target)) {
      return false
    }
  },
  between : function between(params) {
    var length = this.self[0].value.length
    var min = params.range[0]
    var max = params.range[1]
    if (length < min || length > max) {
      return false
    }
  },
  // 纯英文
  onlyEn : function onlyEn() {
    if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
      return false
    }
  },
  // 纯中文
  onlyZh : function onlyZh() {
    if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
      return false
    }
  },
  // 非整数
  notInt : function notInt() {
    if (/^[0-9]*$/.test(this.self[0].value)) {
      return false
    }
  },
  // 数字包含小数
  onlyNum : function onlyNum() {
    if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
      return false
    }
  },
  // 整数
  onlyInt : function onlyInt() {
    if (!/^[0-9]*$/.test(this.self[0].value)) {
      return false
    }
  },
  // 至少选中一项 radio || checkbox
  isChecked : function isChecked() {
    var result = void 0
    this.self.each(function (index, el) {
      result = el.checked
      return !result
    })
    return result ? void 0 : false
  },
  // 昵称
  isNickname : function isNickname() {
    if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
      return false
    }
  },
  // 中英文
  isZhEn : function isZhEn() {
    /// ^[A-Za-z_\-\u4e00-\u9fa5]{2,20}$/i
    if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value) && !/^[A-Za-z]+$/.test(this.self[0].value)) {
      return false
    }
  },
  isCheckBjx : function isCheckBjx() {
    // 验证百家姓
    var val = this.self[0].value
    var iname = val.substr(0, 1)
    var bjxstr = '赵|钱|孙|李|周|吴|郑|王|冯|陈|楮|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|姚|邵|湛|汪|祁|毛|禹|狄|米|贝|明|臧|计|伏|成|戴|谈|宋|茅|庞|熊|纪|舒|屈|项|祝|董|梁|杜|阮|蓝|闽|席|季|麻|强|贾|路|娄|危|江|童|颜|郭|梅|盛|林|刁|锺|徐|丘|骆|高|夏|蔡|田|樊|胡|凌|霍|虞|万|支|柯|昝|管|卢|莫|经|房|裘|缪|干|解|应|宗|丁|宣|贲|邓|郁|单|杭|洪|包|诸|左|石|崔|吉|钮|龚|程|嵇|邢|滑|裴|陆|荣|翁|荀|羊|於|惠|甄|麹|家|封|芮|羿|储|靳|汲|邴|糜|松|井|段|富|巫|乌|焦|巴|弓|牧|隗|山|谷|车|侯|宓|蓬|全|郗|班|仰|秋|仲|伊|宫|宁|仇|栾|暴|甘|斜|厉|戎|祖|武|符|刘|景|詹|束|龙|叶|幸|司|韶|郜|黎|蓟|薄|印|宿|白|怀|蒲|邰|从|鄂|索|咸|籍|赖|卓|蔺|屠|蒙|池|乔|阴|郁|胥|能|苍|双|闻|莘|党|翟|谭|贡|劳|逄|姬|申|扶|堵|冉|宰|郦|雍|郤|璩|桑|桂|濮|牛|寿|通|边|扈|燕|冀|郏|浦|尚|农|温|别|庄|晏|柴|瞿|阎|充|慕|连|茹|习|宦|艾|鱼|容|向|古|易|慎|戈|廖|庾|终|暨|居|衡|步|都|耿|满|弘|匡|国|文|寇|广|禄|阙|东|欧|殳|沃|利|蔚|越|夔|隆|师|巩|厍|聂|晁|勾|敖|融|冷|訾|辛|阚|那|简|饶|空|曾|毋|沙|乜|养|鞠|须|丰|巢|关|蒯|相|查|后|荆|红|游|竺|权|逑|盖|益|桓|公|万俟|司马|上官|欧阳|夏侯|诸葛|闻人|东方|赫连|皇甫|尉迟|公羊|澹台|公冶|宗政|濮阳|淳于|单于|太叔|申屠|公孙|仲孙|轩辕|令狐|锺离|宇文|长孙|慕容|鲜于|闾丘|司徒|司空|丌官|司寇|仉|督|子车|颛孙|端木|巫马|公西|漆雕|乐正|壤驷|公良|拓拔|夹谷|宰父|谷梁|晋|楚|阎|法|汝|鄢|涂|钦|段干|百里|东郭|南门|呼延|归|海|羊舌|微生|岳|帅|缑|亢|况|后|有|琴|梁丘|左丘|东门|西门|商|牟|佘|佴|伯|赏|南宫|墨|哈|谯|笪|年|爱|阳|佟|第五|言|福'

    if (bjxstr.search(iname) === -1) {
      return false
    }
  },
  betweenNum : function betweenNum(params) {
    var num = this.self[0].value
    var minNum = params.range[0]
    var maxNum = params.range[1]
    if (num < minNum || num > maxNum) {
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
      var removeIndex
      $.each(_this.options.collections, function (index, value) {
        if (value.required === requiredName) {
          removeIndex = index
          return false
        }
      })
      _this.options.collections.splice(removeIndex, 1)
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

    requiredName = value.replace(/\[data-required=(.+)\]/g, '$1')

    if ($target.data('event.iui-validate')) {
      return
    }

    if ($.inArray(type, changeHandleArr) !== -1) {
      $target.on('change.iui-validate', { self: _this }, changeEmitter)
      $target.data('event.iui-validate', true)
      return
    }

    $target.on('input propertychange', { self: _this }, inputEmitter)
    $target.on('focus.iui-validate', { self: _this }, focusEmitter)

    if (_this.cache[requiredName].options.unblur !== true) {
      $target.on('blur.iui-validate', { self: _this }, blurEmitter)
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
  var className
  var contextClass
  var msg
  var $target
  var $msgEl
  var errors = this.errors

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
  var $target = _this.$selector.find('[data-required="' + target | '' + '"]')
  var stubData = $.extend(true, {}, _this.cache[target], { matches: { customer: { errMsg: text || '' } } })
  if ($target.length === 0) {
    return `can not found "${target}" in the form`
  }
  $target.data('validateStatus', _code)
  _this.message(code, stubData, 'customer')
}

export default {
  validate : function (options) {
    return new Validate(options, this)
  }
}
