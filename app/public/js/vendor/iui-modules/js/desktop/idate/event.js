let dateUtil = require('../../vendor/dateUtils');
let Event = {
  updateDateView(date, event) {
    event && event.preventDefault();
    let _this = this;
    let _date = date || _this._d;
    _this.update(_date);
    _this.renderDate(_date);
    _this.showDateView(_date);
  },
  updateMonthView(date, event) {
    event && event.preventDefault();
    let _this = this;
    let _date = date || _this._d;
    _this.update(_date);
    _this.renderMonth(_date);
    _this.showMonthView(_date);
  },
  updateYearView(date, event) {
    event && event.preventDefault();
    let _this = this;
    let _date = date || _this._d;
    _this.update(_date);
    _this.renderYear(_date);
    _this.showYearView(_date);

  },
  selectMonth(event) {
    event && event.preventDefault();
    let _this = this;
    let el = event.target;
    let date = new Date(el.title)
    _this.update(date);
    _this.renderDate(date);
    if (_this.config.type === 'month') {
      Event.checked.call(_this, event, 'YYYY-MM');
      return false;
    }
    _this.showDateView();
  },
  selectYear(event) {
    event && event.preventDefault();
    let _this = this;
    let el = event.target;
    let _date = new Date(el.title)
    _this.update(_date);
    _this.renderMonth(_date);
    if (_this.config.type === 'year') {
      Event.checked.call(_this, event, 'YYYY');
      return false;
    }
    _this.showMonthView(_date);
  },
  checked(event, fmt) {
    let _this = this;
    _this.value = $(event.target).attr('title');
    _this.$el.val(fmt ? dateUtil.format(_this.value, fmt) : _this.value);

    $(document).trigger('click.iui-idate')
  }
}

module.exports = Event 
