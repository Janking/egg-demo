/**
 * 拿到url上的参数
 * 调用：$.getQueryString('name', url);
 */
export default {
  getQueryString : function getQueryString(name, url) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var lurl = decodeURIComponent(url || window.location.search)
    var r = lurl.substr(1).match(reg)
    if (r !== null) return r[2]; return null
  }
}
