function IdateTime() {

}

module.exports = {
  idateTime : function (options) {
    return this.each(function (index, el) {
      let date = new IdateTime(options, el)
      $(el).data('idateTime', date)
    })
  },
  defaults : IdateTime
}
