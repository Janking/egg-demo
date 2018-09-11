/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

function extend() {
  var i = 0
  var result = {}
  for (; i < arguments.length; i++) {
    var attributes = arguments[i]
    for (var key in attributes) {
      result[key] = attributes[key]
    }
  }
  return result
}
function converter() { }

var cookie = {
  defaults : {},
  api      : function (key, value, attributes) {
    var result
    var _this = this
    if (typeof document === 'undefined') {
      return
    }

    // 方法：set()
    if (arguments.length > 1) {
      attributes = extend({
        path : '/'
      }, _this.defaults, attributes)

      return setCookie(attributes, value, key)
    }

    // Read
    if (!key) {
      result = {}
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling "get()"
    result = getCookie.call(_this, result, key)

    return result
  },
  set : function (key, value, attributes) {
    return cookie.api(key, value, attributes)
  },
  get : function (key) {
    return cookie.api(key)
  },
  getJson : function () {
    return cookie.api.apply({
      json : true
    }, [].slice.call(arguments))
  },
  remove : function (key, attributes) {
    cookie.api(key, '', extend(attributes, {
      expires : -1
    }))
  },
  clear : function () {
    var json = cookie.getJson()
    for (var key in json) {
      cookie.remove(key)
    }
  }
}

// 设置cookie
function setCookie(attributes, value, key) {
  var stringifiedAttributes
  attributes.expires = expiresHandle(attributes.expires)
  value = valHandle(value, key)
  key = keyHandle(key)
  stringifiedAttributes = getStrAttr(attributes)
  return (document.cookie = key + '=' + value + stringifiedAttributes)
}

// value处理
function valHandle(value, key) {
  value = matchValue(value)
  if (!converter.write) {
    value = encodeURIComponent(String(value))
      .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)
  } else {
    value = converter.write(value, key)
  }
  return value
}
// 匹配返回
function matchValue(value) {
  try {
    var result = JSON.stringify(value)
    if (/^[{[]/.test(result)) {
      value = result
    }
  } catch (e) {
    console.log(e)
  }
  return value
}

// key处理
function keyHandle(key) {
  key = encodeURIComponent(String(key))
  key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
  key = key.replace(/[()]/g, escape)
  return key
}

// expires转换
function expiresHandle(expires) {
  if (typeof expires === 'number') {
    var temp = new Date()
    temp.setMilliseconds(temp.getMilliseconds() + expires * 864e+5)
    expires = temp
  }

  // We're using "expires" because "max-age" is not supported by IE
  return expires ? expires.toUTCString() : ''
}

// 数组类型转换为字符串拼接类型
function getStrAttr(attributes) {
  var stringifiedAttributes = ''

  for (var attributeName in attributes) {
    if (!attributes[attributeName]) {
      continue
    }
    stringifiedAttributes += '; ' + attributeName
    if (attributes[attributeName] === true) {
      continue
    }
    stringifiedAttributes += '=' + attributes[attributeName]
  }
  return stringifiedAttributes
}

function getCookie(result, key) {
  var cookies = document.cookie ? document.cookie.split('; ') : []
  var rdecode = /(%[0-9A-Z]{2})+/g
  var i = 0

  for (; i < cookies.length; i++) {
    var parts = cookies[i].split('=')
    var cookie = parts.slice(1).join('=')

    if (cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1)
    }

    try {
      var name = parts[0].replace(rdecode, decodeURIComponent)
      cookie = converter.read
        ? converter.read(cookie, name) : converter(cookie, name) ||
        cookie.replace(rdecode, decodeURIComponent)

      if (this.json) {
        cookie = parse(cookie)
      }

      if (key === name) {
        result = cookie
        break
      }

      if (!key) {
        result[name] = cookie
      }
    } catch (e) {
      console.log(e)
    }
  }
  return result
}

// 转为json格式
function parse(cookie) {
  try {
    cookie = JSON.parse(cookie)
  } catch (e) {
    console.log(e)
  }
  return cookie
}

export default {
  cookie : cookie
}
