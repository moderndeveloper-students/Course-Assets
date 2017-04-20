(function ($) {
var blocks = $('.block');

blocks.on('click', function (ev) {
  var $b = $(ev.currentTarget)
    , effect = $b.data('effect');

  if (effect == 'addSpecialClass') {
    $b.addClass('special', 1000, 'easeInSine');
  } else {
    $b.effect(effect);
  }

});
})(jQuery);