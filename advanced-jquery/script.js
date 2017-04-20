var oldJq = jQuery.noConflict(true);

(function ($, oldJq) {
  var now = new Date();
  $('.timeago').text(now.toISOString()).timeago();

  oldJq('p').oldPlugin();
})(jQuery, oldJq);