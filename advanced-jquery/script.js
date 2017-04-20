(function ($) {
  var toggles, els;

  var slideUp = function (els, callback) {
    els.animate({
      height: '0px'
    }, 400, function () {
      els.hide();
      if (callback) {
        callback();
      }
    });
  }

  var slideDown = function (els, callback) {
    els.css('height', 0).show();
    els.animate({
      height: '100px'
    }, 400, callback);
  }
  
  toggles = $('.toggle').on('click', 'button', function () {
    slideDown(els, function () {
      slideUp(toggles);
    })
  });

  els = $('.hide-me').on('click', 'button', function () {
    slideUp(els, function () {
      slideDown(toggles);
    })
  });
})(jQuery);