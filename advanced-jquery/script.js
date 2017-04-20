(function ($) {
  var now = new Date();
  $('.timeago').text(now.toISOString()).timeago();
})(jQuery);