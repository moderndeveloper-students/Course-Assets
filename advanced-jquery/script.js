(function ($) {
  var toggles, els;
  
  toggles = $('.toggle').on('click', 'button', function () {
    els.slideDown(400, function () {
      toggles.slideUp('hidden');
    });
  });

  els = $('.hide-me').on('click', 'button', function () {
    els.slideUp(400, function () {
      toggles.slideDown('hidden');
    });
  });

})(jQuery);