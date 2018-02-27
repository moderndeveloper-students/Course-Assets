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
    this.element.data('timeago', this);
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
    this.renderTimeout = setTimeout(function () {
      self.render();
    }, 1000);
    return this;
  }

  Timeago.prototype.stop = function () {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    return this;
  }
  
  $.fn.timeago = function (options) {
    this.each(function () {
      var $el = $(this)
        , instance;
      if (instance = $el.data('timeago')) {
        if (typeof(options) === 'string' && typeof(instance[options]) == 'function') {
          instance[options]();
        } else {
          console.warn('Timeago already initialized on', this, 'and', options, 'is not a valid instance method');
        }
        return;
      }
      new Timeago($el, options);
    });
    return this;
  };
})(jQuery);