(function ($) {
  var toggles, els;
  
  toggles = $('.toggle').on('click', 'button', function () {
    els.fadeIn(400, function () {
      toggles.addClass('hidden');
    });
  });

  els = $('.hide-me').on('click', 'button', function () {
    els.fadeOut(400, function () {
      toggles.removeClass('hidden');
    });
  });

})(jQuery);