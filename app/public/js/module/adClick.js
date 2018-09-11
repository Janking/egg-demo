module.exports = function () {
  $('body').on('click', '.da-item', function (event) {
    var $this = $(this)
    $.get($this.attr('data-url')).then(function (res) {
      if (res.code !== 200) {
        $.alert({
          text: res.msg[0].value,
          status: 0
        })
      }
    })
  })
}
