module.exports = {
  showMonthView() {
    let _this = this;
    _this.currentView = 'month';
    _this.$week.addClass('idate-hidden');
    _this.$dateView.addClass('idate-hidden');
    _this.$yearView.addClass('idate-hidden');
    _this.$monthView.removeClass('idate-hidden');
    _this.renderHeader();
  },
  showDateView() {
    let _this = this;
    _this.currentView = 'date';
    _this.$week.removeClass('idate-hidden');
    _this.$dateView.removeClass('idate-hidden');
    _this.$yearView.addClass('idate-hidden');
    _this.$monthView.addClass('idate-hidden');
    _this.renderHeader();
  },
  showYearView() {
    let _this = this;
    _this.currentView = 'year';
    _this.$week.addClass('idate-hidden');
    _this.$dateView.addClass('idate-hidden');
    _this.$monthView.addClass('idate-hidden');
    _this.$yearView.removeClass('idate-hidden');
    _this.renderHeader();
  },
  show() {
    let _this = this;
    let matrix = _this.$el[0].getBoundingClientRect();
    let _x = matrix.left;
    let _y = matrix.top + matrix.height + 10;
    _this.$container.css({
      left : _x,
      top  : _y
    }).removeClass('idate-hidden');
  }
}
