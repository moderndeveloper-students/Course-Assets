;(function($) {

  var defaults = {
    // set defaults
  };
  
  function Timeago(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.init();
  }

  
  Timeago.prototype.init = function() {
    // plugin logic goes here...
  };
  
  $.fn.timeago = function (options) {
    new Timeago(this, options);
    return this;
  };
  
})(jQuery);