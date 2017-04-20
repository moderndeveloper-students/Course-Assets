(function ($) {
var blocks = $('.block');

blocks.on('click', function (ev) {
  var $b = $(ev.currentTarget)
    , easing = $b.data('easing');

  $b.animate({
    height: '+=200px',
    width: '+=200px',
  }, 600, easing, function () {
    $b.animate({
      height: '-=200px',
      width: '-=200px'
    }, 600, easing);
  })
});
})(jQuery);