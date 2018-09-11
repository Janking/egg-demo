(function () {
	var config = {
		url1: 'http://192.168.0.142:7080/go1?id=999&app=ipv',
		url2: 'http://192.168.0.142:7080/go2?id=999&app=ipv',
		level: '4',
		ekc: '1500973343529lA8LbF5iSP',
		itv: 10000,
		startTime: 1503906811521
	};
	/******/
	(function (modules) { // webpackBootstrap
		/******/ // The module cache
		/******/
		var installedModules = {};

		/******/ // The require function
		/******/
		function __webpack_require__(moduleId) {

			/******/ // Check if module is in cache
			/******/
			if (installedModules[moduleId])
				/******/
				return installedModules[moduleId].exports;

			/******/ // Create a new module (and put it into the cache)
			/******/
			var module = installedModules[moduleId] = {
				/******/
				exports: {},
				/******/
				id: moduleId,
				/******/
				loaded: false
				/******/
			};

			/******/ // Execute the module function
			/******/
			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

			/******/ // Flag the module as loaded
			/******/
			module.loaded = true;

			/******/ // Return the exports of the module
			/******/
			return module.exports;
			/******/
		}


		/******/ // expose the modules object (__webpack_modules__)
		/******/
		__webpack_require__.m = modules;

		/******/ // expose the module cache
		/******/
		__webpack_require__.c = installedModules;

		/******/ // __webpack_public_path__
		/******/
		__webpack_require__.p = "";

		/******/ // Load entry module and return exports
		/******/
		return __webpack_require__(0);
		/******/
	})
	/************************************************************************/
	/******/
	([
		/* 0 */
		/***/
		function (module, exports, __webpack_require__) {

			'use strict';

			var utils = __webpack_require__(1);
			var domUtils = __webpack_require__(2);
			var eventOn = __webpack_require__(3);
			var store = __webpack_require__(4).store;
			var root = window;
			var doc = document;
			var location = root.location;
			var screen = root.screen;
			var nav = root.navigator;
			var interval = root.setInterval;
			var basic = {
				clickTime: 500,
				maxLength: 3
				// let serverTime = config.startTime
			};
			var clientTime = utils.now();
			var pvFlag = true;
			var isFirstSend = true;
			var getSid = createSid();
			var commonAction = {
				ekc: config.ekc,
				sid: getSid[1],
				tt: domUtils.getMeta.tt,
				kw: domUtils.getMeta.kw,
				cu: location.href,
				pu: domUtils.getRef()
			};

			var baseAction = {
				rl: screen.width + '*' + screen.height,
				ua: __webpack_require__(5),
				lang: nav.language || nav.browserLanguage,
				ct: function () {
					var ct = nav.connection || nav.mozConnection || nav.webkitConnection || nav.oConnection;
					var c = utils.hasIt(nav.userAgent, 'mobile') && ct ? ct.type : 'unknow';
					return c;
				}(),
				pf: function () {
					var value = pvFlag ? 1 : 0;
					pvFlag = 0;
					return value;
				}(),
				ins: getSid[0],
				vd: getSid[2],
				ce: nav.cookieEnabled ? 1 : 0,
				cd: screen.colorDepth || screen.pixelDepth,
				ds: domUtils.getMeta.ds
			};
			var userAction = {
				rc: [],
				se: [],
				dr: 0,
				nu: ''
			};

			root.$51helper = function () {
				var topics = {};
				var hOP = topics.hasOwnProperty;
				return root.$51helper && utils.isO(root.$51helper) ? root.$51helper : {
					sub: function sub(topic, listener) {
						if (!hOP.call(topics, topic)) topics[topic] = [];
						var index = topics[topic].push(listener) - 1;
						return {
							remove: function remove() {
								delete topics[topic][index];
							}
						};
					},
					pub: function pub(topic, info) {
						if (!hOP.call(topics, topic)) return;
						utils.each(topics[topic], function (index, item) {
							item(info !== undefined ? info : {});
						});
					}
				};
			}();

			function createSid() {
				var tins = void 0;
				var siteId = utils.getParam('id', config.url1);
				try {
					tins = store.get('__tins__' + siteId);
				} catch (e) {
					tins = false;
				}
				var isNewSession = tins && utils.isN(tins.sid) && utils.isN(tins.expires) && utils.now() - tins.sid < 18e5 ? 0 : 1;
				var returnVisit = isNewSession ? 1 : tins.vd + 1;
				var time = isNewSession ? utils.now() : tins.sid;
				var timeout = utils.now() + 18e5;
				store.set('__tins__' + siteId, JSON.stringify({
					sid: time,
					vd: returnVisit,
					expires: timeout
				}), null, '/');
				return [isNewSession, isNewSession ? time : store.get('__tins__' + siteId).sid, returnVisit];
			}

			var extendAction = {};
			// let overflowRecord = []

			function send() {
				root.$51helper.pub('__tvt__' + clientTime);
				var result = JSON.parse(JSON.stringify(isFirstSend ? utils.extend({}, baseAction, commonAction) : utils.extend({}, userAction, extendAction, commonAction)));
				// if (utils.obj2url(result).length > 1.8e3 && result.rc && result.rc.length) {
				//   overflowRecord = result.rc.splice(result.rc.length - 1, 1)
				//   userAction.rc = overflowRecord.splice(0)
				// }
				var serialize = utils.obj2url(result);
				var params = (isFirstSend ? config.url1 : config.url2) + '&rt=' + clientTime + '&' + serialize;
				var img = new Image(1, 1);
				img.src = params;
				isFirstSend = false;
				// 开启 debug 模式
				if (localStorage.getItem('__trace__debug__') === '1' && window.console) {
					console.log(JSON.stringify(result, null, 4));
				}
				userAction.rc.length = 0;
				userAction.dr = 0;
				userAction.nu = '';
			}

			send.version = '2.2.1.1';

			// 心跳计算
			var durStartTime = void 0;
			var heartbeat = void 0;
			(function () {
				// 1800000
				var expireTime = 18e5; // config.itv
				var endTime = durStartTime = utils.now();
				var it = interval(heartStop, expireTime);
				// 十五分钟没心跳时触发
				function heartStop() {
					clearInterval(it);
					heartbeat = 1;
				}
				interval(function () {
					if (heartbeat === 1) {
						heartbeat = 2;
						send();
					}
				}, 1000);

				eventOn(doc, 'mousemove keydown scroll', function () {
					if (heartbeat === 2) {
						// config.startTime += (utils.now() - clientTime)
						clientTime = utils.now();
						heartbeat = 0;
						durStartTime = utils.now();
						isFirstSend = true;
						pvFlag = true;
						getSid = createSid();
						baseAction.ins = getSid[0];
						commonAction.sid = getSid[1];
						baseAction.vd = getSid[2];
						send();
					}
					clearInterval(it);
					it = interval(heartStop, expireTime);
				});

				root.$51helper.sub('__tvt__' + clientTime, function () {
					var isHeartStop = heartbeat === 2 ? expireTime : 0;
					endTime = utils.now();
					userAction.dr = endTime - durStartTime - isHeartStop;
					userAction.dr = userAction.dr < 0 ? 0 : userAction.dr;
					durStartTime = utils.now();
				});
			})();

			__webpack_require__(6)(doc, root, userAction, clientTime);
			__webpack_require__(7)(doc, root, userAction, basic, clientTime, send);
			__webpack_require__(8)(baseAction);

			root.domReady(function () {
				userAction.lt = domUtils.performance();
			});

			var hook = /a1|a2|b1|b2|c1|c2|d1|d2|e1|e2/;
			root.$51helper.sub('__push__', function (data) {
				var exField = utils.isO(data) ? data : {};
				utils.each(exField, function (index, val) {
					if (hook.test(index)) {
						extendAction[index] = ('' + val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 100);
					}
				});
				if (isFirstSend) {
					send();
				}
				send();
			});

			send();

			eventOn(root, domUtils.isMobi ? 'unload' : 'beforeunload', function () {
				userAction.rd = root.$51helper.pageTimesIndex + '|' + userAction.rd;
				send();
			});
			// 扫描record
			interval(function () {
				if (userAction.rc.length && !isFirstSend) {
					send();
				}
			}, 3000);

			if (root.addEventListener) {
				var heatmap = void 0;
				eventOn(root, 'message', function (event) {
					if (event.data && event.origin.indexOf('51.la') !== -1) {
						var elementsData = JSON.parse(event.data);
						if (heatmap) {
							root.$51helper.pub('heatmap', elementsData);
							return false;
						} else {
							heatmap = domUtils.getJs(event.origin + '/pv/resources/backend/js/build/modules/heatmapDrawManager.js');
							heatmap.onload = function () {
								root.$51helper.pub('heatmap', elementsData);
							};
						}
					}
				});
			}

			/***/
		},
		/* 1 */
		/***/
		function (module, exports) {

			'use strict';

			var encode = encodeURIComponent;
			var decode = decodeURIComponent;
			var isO = typeOf('Object');
			var isN = typeOf('Number');
			var isS = typeOf('String');
			var isR = typeOf('RegExp');
			var isF = typeOf('Function');
			var isNu = typeOf('Null');
			var isA = typeOf('Array');

			function hasIt(src, str) {
				return src !== void 0 && src.indexOf(str) !== -1;
			}

			function typeOf(type) {
				return function (object) {
					return Object.prototype.toString.call(object) === '[object ' + type + ']';
				};
			}

			function getParam(name, url) {
				if (typeof name !== 'string') return false;
				if (!url) url = window.location.href;
				name = name.replace(/[[\]]/g, '\\$&');
				var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
				var results = regex.exec(url);
				if (!results) return null;
				if (!results[2]) return '';
				return decode(results[2].replace(/\+/g, ' '));
			}

			function each(obj, callback) {
				var name = void 0;
				var i = 0;
				var length = obj.length;
				var isObj = length === undefined || isA(obj);
				if (isObj) {
					for (name in obj) {
						if (callback.call(obj[name], name, obj[name]) === false) {
							break;
						}
					}
				} else {
					for (; i < length;) {
						if (callback.call(obj[i], i, obj[i++]) === false) {
							break;
						}
					}
				}
			}

			function has(obj, key) {
				return obj !== null && Object.prototype.hasOwnProperty.call(obj, key);
			}

			function keys(obj) {
				if (!isO(obj)) return [];
				if (Object.keys) return Object.keys(obj);
				var keys = [];
				for (var key in obj) {
					if (has(obj, key)) keys.push(key);
				}
				return keys;
			}

			function extend() {
				var i = 0;
				var result = {};
				for (; i < arguments.length; i++) {
					var attributes = arguments[i];
					for (var key in attributes) {
						result[key] = attributes[key];
					}
				}
				return result;
			}

			function unique(target) {
				var arr = target;
				var newArr = [];
				var i = 0;
				var j = 0;
				var obj = {};
				var len = arr.length;
				while (len--) {
					if (!obj[arr[i]]) {
						obj[arr[i]] = 1;
						newArr[j] = arr[i];
						j++;
					}
					i++;
				}
				return newArr;
			}

			function spreator(str) {
				return str.replace(/&/g, '~_~');
			}

			function obj2url(object) {
				var pairs = [];
				var isJson = void 0;
				for (var prop in object) {
					if (has(object, prop)) {
						var k = encode(encode(spreator(prop)));
						var v = '';
						if (!isS(object[prop])) {
							if (isA(object[prop]) && object[prop].length === 0) {
								v = '';
							} else {
								isJson = JSON.stringify(object[prop]);
								isJson = isJson ? spreator(isJson) : isJson;
								v = encode(encode(isJson));
							}
						} else {
							v = encode(encode(spreator(object[prop])));
						}
						pairs.push(k + '=' + v);
					}
				}
				return pairs.join('&');
			}

			function trim(txt) {
				return txt.replace(/^\s+|\s+$/g, '');
			}

			function now() {
				return +new Date();
			}

			function nativeArray(arr) {
				var tmp = [];
				each(arr, function (index, val) {
					tmp[index] = val;
				});
				return tmp;
			}

			module.exports = {
				isO: isO,
				isN: isN,
				isS: isS,
				isR: isR,
				isF: isF,
				isNu: isNu,
				hasIt: hasIt,
				each: each,
				has: has,
				keys: keys,
				extend: extend,
				unique: unique,
				obj2url: obj2url,
				trim: trim,
				now: now,
				nativeArray: nativeArray,
				getParam: getParam
			};

			/***/
		},
		/* 2 */
		/***/
		function (module, exports, __webpack_require__) {

			'use strict';

			var utils = __webpack_require__(1);
			var root = window;
			var doc = root.document;
			var nav = window.navigator;
			var isMobi = utils.hasIt(nav.userAgent.toLowerCase(), 'mobile');
			var getSelectText = function () {
				return function () {
					return (root.getSelection ? utils.trim(root.getSelection() + '') : utils.trim(doc.selection.createRange().text)).slice(0, 20);
				};
			}();

			var getAbsUrl = function () {
				var a;
				return function (url) {
					if (!a) a = doc.createElement('a');
					a.href = url;
					return a.href;
				};
			}();

			var getMeta = function () {
				var k = getTagName('meta');
				var t = getTagName('title');
				var result = {
					kw: '',
					ds: ''
				};
				var cur = void 0;
				result.tt = t && utils.trim(t[0].innerHTML) || '';
				for (var i = 0; i < k.length; i++) {
					if (k[i].name) {
						cur = k[i].name.toLowerCase();
						if (utils.hasIt('keywords', cur)) {
							result.kw = k[i].content.slice(0, 100);
						}
						if (utils.hasIt('description', cur)) {
							result.ds = k[i].content.slice(0, 30);
						}
					}
				}
				return result;
			}();

			var getSelfUrl = function () {
				var scripts = doc.getElementsByTagName('script');
				var index = scripts.length - 1;
				var myScript = scripts[index];
				return function () {
					return myScript.src;
				};
			}();

			function performance() {
				var requestStart = root.performance ? root.performance.timing.navigationStart : typeof __tstart__ !== 'undefined' && typeof __tstart__ === 'number' ? __tstart__ : utils.now();
				var result = Math.abs(utils.now() - requestStart);
				return result;
			}

			function hasChild(elm) {
				var child = void 0;
				var rv = void 0;
				if (elm.children) {
					// Supports `children`
					rv = elm.children.length !== 0;
				} else {
					// The hard way...
					rv = false;
					for (child = elm.firstChild; !rv && child; child = child.nextSibling) {
						if (child.nodeType === 1) {
							// 1 == Element
							rv = true;
						}
					}
				}
				return rv;
			}

			function getTagName(tagname) {
				return doc.getElementsByTagName(tagname.toLowerCase());
			}

			function prefixUrl(url) {
				if (/^https?:\/\//.test(url)) {
					return url;
				} else {
					return getAbsUrl(url);
				}
			}

			function getRef() {
				var referrer = '';
				try {
					referrer = root.top.document.referrer;
				} catch (e) {
					if (root.parent) {
						try {
							referrer = root.parent.document.referrer;
						} catch (e2) {
							referrer = '';
						}
					}
				}
				if (referrer === '') {
					referrer = doc.referrer;
				}
				return referrer;
			}

			function getSeleVal(select) {
				var result = [];
				var options = select && select.options;
				var opt = void 0;
				for (var i = 0, iLen = options.length; i < iLen; i++) {
					opt = options[i];
					if (opt.selected) {
						result.push(opt.value || opt.text);
					}
				}
				return result.join('||');
			}

			function getCkxVal(target) {
				var result = [];
				var group = getElem(target.nodeName, target.name);
				utils.each(group, function (index, name) {
					if (name.checked) {
						result.push(name.value);
					}
				});
				return result;
			}

			function getElem(tag, name) {
				var result = doc.getElementsByName(name);
				if (result.length > 0) return result;
				result = [];
				var e = getTagName(tag);
				for (var i = 0; i < e.length; i++) {
					if (e[i].getAttribute('name') === name) {
						result[result.length] = e[i];
					}
				}
				return result;
			}
			/**
			 * get dynamic script url
			 */
			function getDSUrl() {
				var scripts = doc.getElementsByTagName('script');
				var url = '';
				var i = void 0;
				for (i = 0; i < scripts.length; i++) {
					if (scripts[i].selfSrc) {
						url = scripts[i].selfSrc;
					}
				}
				return url;
			}
			/**
			 * get body height
			 */
			function getBH(el) {
				var target = el;
				target = el.document ? el.document.getElementsByTagName('body')[0] : el;
				return target.offsetHeight;
			}

			function getST(el) {
				return el === void 0 || el.nodeType === 9 ? doc.documentElement.scrollTop || doc.body.scrollTop : el.scrollTop;
			}

			function getJs(url) {
				var head = getTagName('head')[0];
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = url;
				head.appendChild(script);
				return script;
			}
			/**
			 * dom ready
			 */
			(function () {
				var isReady = 0;
				var isBind = 0;
				var fns = [];
				// let testEl = doc.createElement('p')
				var bindReady = void 0;
				var _init = void 0;
				root.domReady = function (fn) {
					bindReady(fn);
					if (isReady) {
						fn();
					} else {
						fns.push(fn);
					}
				};
				bindReady = function bindReady() {
					if (isBind) return;
					isBind = 1;
					// Catch cases where domReady is called after the browser event has already occurred.
					// readyState: "uninitalized"、"loading"、"interactive"、"complete" 、"loaded"
					if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
						_init();
					} else if (doc.addEventListener) {
						doc.addEventListener('DOMContentLoaded', function evt() {
							doc.removeEventListener('DOMContentLoaded', evt, false);
							_init();
						}, false);
						root.addEventListener('onload', _init, false);
					} else if (doc.attachEvent) {
						// In IE, ensure firing before onload, maybe late but safe also for iframes.
						doc.attachEvent('onreadystatechange', function evt() {
							if (doc.readyState === 'complete') {
								doc.detachEvent('onreadystatechange', evt);
								_init();
							}
						});
						root.attachEvent('onload', _init);
						// If IE and not a frame, continually check to see if the document is ready.
						// if (testEl.doScroll && root === root.top) {
						//   doScrollCheck()
						// }
					}
				};
				// Process items when the DOM is ready.
				_init = function init() {
					isReady = 1;
					// Make sure body exists, at least, in case IE gets a little overzealous.
					// This is taked directly from jQuery's implementation.
					if (!doc.body) {
						setTimeout(_init, 10);
						return;
					}
					for (var i = 0, l = fns.length; i < l; i++) {
						fns[i]();
					}
					fns = [];
				};

				// function doScrollCheck() {
				//   if (isReady) return
				//   try {
				//     // If IE is used, use the trick by Diego Perini
				//     // http://javascript.nwbox.com/IEContentLoaded/
				//     testEl.doScroll('left')
				//   } catch (e) {
				//     setTimeout(doScrollCheck, 10)
				//     return
				//   }
				//   init()
				// }
			})();

			module.exports = {
				isMobi: isMobi,
				hasChild: hasChild,
				prefixUrl: prefixUrl,
				performance: performance,
				getSelectText: getSelectText,
				getAbsUrl: getAbsUrl,
				getMeta: getMeta,
				getTagName: getTagName,
				getJs: getJs,
				getSelfUrl: getSelfUrl,
				getRef: getRef,
				getSeleVal: getSeleVal,
				getCkxVal: getCkxVal,
				getElem: getElem,
				getDSUrl: getDSUrl,
				getBH: getBH,
				getST: getST
			};

			/***/
		},
		/* 3 */
		/***/
		function (module, exports) {

			'use strict';

			var bind = function () {
				if (document.addEventListener) {
					return function (ele, type, fn) {
						ele.addEventListener(type, fn, false);
					};
				} else if (document.attachEvent) {
					return function (ele, type, fn) {
						ele.attachEvent('on' + type, fn);
					};
				}
				return function (ele, type, fn) {
					ele['on' + type] = fn;
				};
			}();

			module.exports = function (ele, types, fn) {
				var events = types.split(' ');
				var i = 0;
				var len = events.length;
				for (; i < len; i++) {
					bind(ele, events[i], fn);
				}
			};

			/***/
		},
		/* 4 */
		/***/
		function (module, exports, __webpack_require__) {

			'use strict';

			var utils = __webpack_require__(1);
			var cookie = {
				get: function get(sKey) {
					return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=s*([^;]*).*$)|^.*$'), '$1')) || null;
				},
				set: function set(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
					if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
						return false;
					}
					var sExpires = '';
					if (vEnd) {
						switch (vEnd.constructor) {
							case Number:
								sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
								break;
							case String:
								sExpires = '; expires=' + vEnd;
								break;
							case Date:
								sExpires = '; expires=' + vEnd.toUTCString();
								break;
						}
					}
					document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
					return true;
				}
				// ,
				// has: function (sKey) {
				//   return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
				// }
			};
			var store = {
				get: function get(name) {
					return JSON.parse(utils.isMobi ? window.localStorage.getItem(name) : cookie.get(name));
				},
				set: function set(name, value, time, path) {
					return utils.isMobi ? window.localStorage.setItem(name, value) : cookie.set(name, value, time, path);
				}
			};

			module.exports = {
				cookie: cookie,
				store: store
			};

			/***/
		},
		/* 5 */
		/***/
		function (module, exports, __webpack_require__) {

			'use strict';

			var utils = __webpack_require__(1);
			var nav = navigator;
			module.exports = function () {
				var NA_VERSION = '-1';
				var NA = {
					name: 'unknow',
					version: NA_VERSION
					// 规则校验器
				};

				function detect(name, expression, ua) {
					var expr = utils.isF(expression) ? expression(ua) : expression;
					if (!expr) {
						return null;
					}
					var info = {
						name: name,
						version: NA_VERSION,
						codename: ''
					};
					if (expr === true) {
						return info;
					}
					if (utils.isS(expr)) {
						if (ua.indexOf(expr) !== -1) {
							return info;
						}
					}
					if (utils.isO(expr)) {
						if (expr.hasOwnProperty('version')) {
							info.version = expr.version;
						}
						return info;
					}
					if (utils.isR(expr)) {
						var m = expr.exec(ua);
						if (m) {
							if (m.length >= 2 && m[1]) {
								info.version = m[1].replace(/_/g, '.');
							} else {
								info.version = NA_VERSION;
							}
							return info;
						}
					}
				}
				// 初始化识别
				function init(ua, patterns, factory) {
					var detected = NA;
					utils.each(patterns, function (index, pattern) {
						var d = detect(pattern[0], pattern[1], ua);
						if (d) {
							detected = d;
							return false;
						}
					});
					factory(detected.name, detected.version);
				}

				function parse(ua, rules) {
					var device = [];
					init((ua || '').toLowerCase(), rules, function (name, version) {
						device = [name, version, version];
					});
					return device;
				}
				var WebRules = function () {
					// var win = root;
					// var NA_VERSION = '-1';
					// 硬件设备信息识别表达式.
					// 使用数组可以按优先级排序.
					var DEVICES = [
						['nokia', function (ua) {
							// 不能将两个表达式合并,因为可能出现 'nokia; nokia 960'
							// 这种情况下会优先识别出 nokia/-1
							if (ua.indexOf('nokia ') !== -1) {
								return (/\bnokia ([0-9]+)?/);
							} else {
								return (/\bnokia([a-z0-9]+)?/);
							}
						}], // 三星有 Android 和 WP 设备.
						['samsung', function (ua) {
							if (ua.indexOf('samsung') !== -1) {
								return (/\bsamsung(?:[-](?:sgh|gt|sm))?-([a-z0-9]+)/);
							} else {
								return (/\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/);
							}
						}],
						['wp', function (ua) {
							return ua.indexOf('windows phone ') !== -1 || ua.indexOf('xblwp') !== -1 || ua.indexOf('zunewp') !== -1 || ua.indexOf('windows ce') !== -1;
						}],
						['pc', 'windows'],
						['ipad', 'ipad'], // ipod 规则应置于 iphone 之前.
						['ipod', 'ipod'],
						['iphone', /\biphone\b\s(\ds?)|\biphone\b|\biph(\d)/],
						['mac', 'macintosh'], // 小米
						['mi', /\bmi[-]?([a-z0-9 ]+(?= build|\)))/], // 红米
						['hongmi', /\bhm[-]?([a-z0-9]+)/],
						['aliyun', /\baliyunos\b(?:[-](\d+))?/],
						['meizu', function (ua) {
							return ua.indexOf('meizu') >= 0 ? /\bmeizu[/]([a-z0-9]+)\b/ : /\bm([0-9cx]{1,4})\b/;
						}],
						['nexus', /\bnexus ([0-9s.]+)/],
						['huawei', function (ua) {
							var reMediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
							if (ua.indexOf('huawei-huawei') !== -1) {
								return (/\bhuawei-huawei-([a-z0-9-]+)/);
							} else if (reMediapad.test(ua)) {
								return reMediapad;
							} else {
								return (/\bhuawei[ _-]?([a-z0-9]+)/);
							}
						}],
						['lenovo', function (ua) {
							if (ua.indexOf('lenovo-lenovo') !== -1) {
								return (/\blenovo-lenovo[-]([a-z0-9]+)/);
							} else {
								return (/\blenovo[-]?([a-z0-9]+)/);
							}
						}], // 中兴
						['zte', function (ua) {
							if (/\bzte-[tu]/.test(ua)) {
								return (/\bzte-[tu][_-]?([a-su-z0-9+]+)/);
							} else {
								return (/\bzte[_-]?([a-su-z0-9+]+)/);
							}
						}], // 步步高
						['vivo', /\bvivo(?: ([a-z0-9]+))?/],
						['htc', function (ua) {
							if (/\bhtc[a-z0-9_-]+(?= build\b)/.test(ua)) {
								return (/\bhtc[_-]?([a-z0-9 ]+(?= build))/);
							} else {
								return (/\bhtc[_-]?([a-z0-9 ]+)/);
							}
						}],
						['oppo', /\boppo[_]([a-z0-9]+)/],
						['konka', /\bkonka[_-]([a-z0-9]+)/],
						['sonyericsson', /\bmt([a-z0-9]+)/],
						['coolpad', /\bcoolpad[_ ]?([a-z0-9]+)/],
						['lg', /\blg[-]([a-z0-9]+)/],
						['android', /\bandroid\b|\badr\b/],
						['blackberry', function (ua) {
							if (ua.indexOf('blackberry') >= 0) {
								return (/\bblackberry\s?(\d+)/);
							}
							return 'bb10';
						}]
					];
					return DEVICES;
				}();
				var userAgent = nav.userAgent || '';
				var appVersion = nav.appVersion || '';
				var vendor = nav.vendor || '';
				var ua = userAgent + ' ' + appVersion + ' ' + vendor;
				return parse(ua, WebRules).join(',');
			}();

			/***/
		},
		/* 6 */
		/***/
		function (module, exports, __webpack_require__) {

			'use strict';

			var utils = __webpack_require__(1);
			var eventOn = __webpack_require__(3);
			var domUtils = __webpack_require__(2);
			var pageTimes = [];
			module.exports = function (doc, win, userAction, clientTime) {
				var pageCalc = typeof __env__ === 'number' && __env__ < 2 || utils.getParam('env', domUtils.getDSUrl() || domUtils.getSelfUrl());
				var vh = Math.max(doc.documentElement.clientHeight, win.innerHeight || 0);
				if (pageCalc && parseInt(pageCalc)) {
					win.domReady(function () {
						var scrollHandle = typeof __scroEl__ !== 'undefined' && utils.isO(__scroEl__) ? __scroEl__ : win;
						var bodyHeight = domUtils.getBH(scrollHandle);
						var pageAmount = Math.ceil(bodyHeight / 500);
						var pageRelative = Math.round(vh / 500);
						var st = domUtils.getST(scrollHandle === win ? undefined : scrollHandle);
						var readDepthTimer = setInterval(calcPageTime, 1000);
						var pageCurrent = Math.floor(st / 500);
						var pageTimesClone = []; // 存储每屏的上一次记录时长
						var pageTimeStart = []; // 存储每屏的开始时间
						pageTimes.length = pageAmount;

						function calcPageTime() {
							var i = void 0;
							var index = [];
							var prev = 0;
							if (pageRelative > 1) {
								for (i = 0; i < pageRelative; i++) {
									index.push(pageCurrent + i);
								}
							} else {
								index.push(pageCurrent);
							}
							utils.each(index, function (key, val) {
								prev = pageTimesClone[val] || 0;
								pageTimeStart[val] = pageTimeStart[val] || utils.now() - 1000;
								pageTimes[val] = utils.now() - pageTimeStart[val] + prev;
								pageTimes.index = val + 1;
							});
							win.$51helper.pageTimesIndex = pageTimes.index;
							userAction.rd = pageTimes.join(',');
						}
						eventOn(scrollHandle, 'scroll', function () {
							clearInterval(readDepthTimer);
							pageTimesClone = pageTimes.slice(0);
							pageTimeStart = [];
							st = domUtils.getST(scrollHandle === win ? undefined : scrollHandle);
							pageCurrent = Math.floor(st / 500);
							readDepthTimer = setInterval(calcPageTime, 1000);
						});
					});
				}

				if (pageCalc && !parseInt(pageCalc)) {
					(function () {
						var pageTimeStart = [];
						var pageTimesClone = []; // 存储每屏的上一次记录时长
						var readDepthTimer = setInterval(function () {
							pageTimesClone[0] = pageTimesClone[0] || 0;
							pageTimes[0] = utils.now() - clientTime;
							pageTimeStart[0] = utils.now();
							win.$51helper.pageTimesIndex = pageTimes.index = 1;
							userAction.rd = pageTimes.join(',');
						}, 1000);
						win.$51helper.sub('__tp__', function (index) {
							if (!utils.isN(index)) {
								return false;
							}
							if (index > 50 || index < 0) {
								return false;
							}
							var pageIndex = index ? index - 1 : index;
							clearInterval(readDepthTimer);
							pageTimeStart[pageIndex] = utils.now();
							pageTimesClone = pageTimes.slice(0);
							readDepthTimer = setInterval(function () {
								pageTimesClone[pageIndex] = pageTimesClone[pageIndex] || 0;
								pageTimes[pageIndex] = utils.now() - pageTimeStart[pageIndex] + pageTimesClone[pageIndex];
								win.$51helper.pageTimesIndex = pageTimes.index = pageIndex + 1;
								userAction.rd = pageTimes.index + '|' + pageTimes.join(',');
							}, 1000);
						});
					})();
				}
			};

			/***/
		},
		/* 7 */
		/***/
		function (module, exports, __webpack_require__) {

			'use strict';

			var utils = __webpack_require__(1);
			var domUtils = __webpack_require__(2);
			var eventOn = __webpack_require__(3);
			var inputElement = /TEXTAREA|INPUT/;
			var checkedRegexp = /radio|checkbox|select/;
			var htmlReg = /HTML|BODY|FORM|SELECT|OPTION|TEXTAREA|LABEL|AUDIO|CANVAS|VIDEO|TABLE|TR|TBODY|THEAD|TFOOT|AREA|CANVAS|IFRAME|INPUT/;
			var queryCache = {};
			var forceLoopCount = 0;
			var forceLoopQueen = null;
			var nextUrl = [];

			module.exports = function (doc, win, userAction, basic, clientTime, callback) {
				function fillEle(target, type) {
					var ele = {};
					var nodeName = target.nodeName.toLowerCase();
					var eleArr = void 0;
					var idArr = [];
					ele.eventType = type;
					if (target.__tidx__) {
						ele.id = target.__tidx__;
					} else {
						if (queryCache[nodeName]) {
							eleArr = queryCache[nodeName];
						} else {
							eleArr = queryCache[nodeName] = utils.nativeArray(domUtils.getTagName(nodeName));
						}
						utils.each(eleArr, function (index, el) {
							if (el === target) {
								idArr.push(el.nodeName);
								idArr.push(index);
								idArr.push(el.id || '');
								idArr.push(el.type || '');
								idArr.push(el.getAttribute('name') || '');
								ele.id = target.__tidx__ = '_tidx_' + idArr.join(';');
							}
						});
					}
					ele.timestamp = utils.now() - clientTime;
					return ele;
				}

				function captureInput(event) {
					var _this = this;
					var elProp = fillEle(_this, 'keyup');
					setTimeout(function () {
						elProp.value = _this.value;
						userAction.rc.push(elProp);
					}, 3000);
					if (_this.removeEventListener) {
						_this.removeEventListener('blur', captureInput, false);
					} else {
						_this.detachEvent('onblur', captureInput);
					}
				}

				function getElePro(src, event) {
					var text = domUtils.getSelectText();
					var isSelection = !!(text && !inputElement.test(src.nodeName)) && utils.hasIt(src.innerText || src.contentText, text);
					var isChecked = checkedRegexp.test(src.type) || src.nodeName === 'OPTION';
					var type = isSelection ? 'select' : isChecked ? 'change' : 'click';
					var elePro = getElePro[type].call(src, event);
					collectBehavior(src, elePro, event);
				}

				function collectBehavior(src, elePro, event) {
					var pp = src.getBoundingClientRect();
					var nodeName = src.nodeName;
					// 相对坐标
					elePro.pp = [parseInt(event.clientX - pp.left), parseInt(event.clientY - pp.top), pp.width, pp.height].join();
					// 0 : 点击图, 1: 热力图
					elePro.ht = !htmlReg.test(nodeName) || utils.hasIt('A,IMG,BUTTON', nodeName) && domUtils.hasChild(src) ? 0 : 1;
					// 防止重复点击,阈值为10
					if (src.__tidx__ !== forceLoopQueen) {
						forceLoopCount = 0;
					}
					if (forceLoopCount > 10) {
						return false;
					}
					forceLoopQueen = src.__tidx__;
					forceLoopCount++;
					if (utils.keys(elePro).length > 0) {
						var arr = userAction.rc;
						if (elePro.id) {
							arr.push(elePro);
						}
						if (arr.length === basic.maxLength) {
							callback();
						}
					}
				}

				getElePro.click = function () {
					basic.clickTime = utils.now();
					var elePro = fillEle(this, 'click');
					var text = utils.trim(this.innerText || this.textContent || '').replace(/(\r\n|\n|\r)/gm, '');
					elePro.text = text.substr(0, 15);
					return elePro;
				};

				getElePro.change = function () {
					var elePro = fillEle(this, 'change');
					elePro.value = this.value;
					if (this.type === 'checkbox') {
						elePro.value = domUtils.getCkxVal(this).join('||');
					}
					if (this.nodeName === 'OPTION') {
						elePro.value = domUtils.getSeleVal(this.parentElement);
					}
					if (utils.hasIt(this.type, 'select')) {
						elePro.value = domUtils.getSeleVal(this);
					}
					return elePro;
				};

				getElePro.select = function () {
					var elePro = fillEle(this, 'select');
					elePro.text = domUtils.getSelectText().replace(/(\r\n|\n|\r)/gm, '');
					return elePro;
				};

				eventOn(document, 'click', function (e) {
					var target = e.target || e.srcElement;
					var hrefPro = '';
					var regHref = /^javascript.*$|^#.*$/gi;
					var parentEl = null;
					if (target.nodeName === 'A' && !regHref.test(hrefPro)) {
						hrefPro = target.href ? target.getAttribute('href') : '#';
					} else {
						utils.each([1, 2, 3, 4], function () {
							var _this = parentEl || target;
							if (_this.parentNode) {
								var nodeName = _this.parentNode.nodeName;
								parentEl = _this.parentNode;
								if (nodeName === 'BODY' || nodeName === 'HTML') {
									return false;
								}
							} else {
								parentEl = _this;
								return false;
							}
							return parentEl.nodeName !== 'A';
						});

						hrefPro = parentEl.nodeName === 'A' ? parentEl.getAttribute('href') : '';
					}
					if (hrefPro && !regHref.test(hrefPro)) {
						nextUrl.push(domUtils.prefixUrl(hrefPro));
					}
					userAction.nu = utils.unique(nextUrl).join(',');
				});

				eventOn(document.body, 'click', function (event) {
					var target = event.target || event.srcElement;
					var type = target.type;
					var isInput = inputElement.test(target.nodeName) && /text|email|number|tel|url|textarea/.test(type);
					if (target.offsetWidth && target.offsetHeight) {
						if (isInput) {
							eventOn(target, 'blur', captureInput);
						} else {
							getElePro(target, event);
						}
					}
				});
			};

			/***/
		},
		/* 8 */
		/***/
		function (module, exports, __webpack_require__) {

			'use strict';

			var utils = __webpack_require__(1);
			var storeUtils = __webpack_require__(4);
			module.exports = function (baseAction) {
				var __51laig__ = storeUtils.store.get('__51laig__');
				// 判断是否为新老访客
				if (!utils.isN(__51laig__)) {
					__51laig__ = 1;
				} else {
					__51laig__ = parseInt(__51laig__) + 1;
				}
				storeUtils.cookie.set('__51cke__', config.ekc, null, '/');
				baseAction.ing = __51laig__;
				storeUtils.store.set('__51laig__', __51laig__, null, '/');
			};

			/***/
		}
		/******/
	]);
}());
