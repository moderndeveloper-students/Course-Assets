;(function($) {

  var defaults = {
    // set defaults
  };

  var getDate = function (element) {
    var date = element.attr('date');
    if (!date && element.text()) {
      date = element.text();
    }
    if (!date) {
      throw("No date could be found for", element);
    }
    return date;
  }
  
  function Timeago(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.init();
  }

  
  Timeago.prototype.init = function() {
    this.date = getDate(this.element);
    this.dateMoment = moment(this.date);
    this.render();
  };

  Timeago.prototype.render = function () {
    var str = this.dateMoment.fromNow();
    this.element.text(str);
    var self = this;
    setTimeout(function () {
      self.render();
    }, 1000);
    return this;
  }
  
  $.fn.timeago = function (options) {
    this.each(function () {
      new Timeago($(this), options);
    });
    return this;
  };
})(jQuery);