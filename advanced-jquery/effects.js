(function ($) {
var blocks = $('.block');

blocks.on('click', function (ev) {
  var $b = $(ev.currentTarget)
    , effect = $b.data('effect');

  $b.effect(effect);
});
})(jQuery);