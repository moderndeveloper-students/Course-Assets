(function ($) {
  var counter = $('.animate-me .counter');
  var setPercent = function (val) {
    counter.find('.percent').text(val);
  }

  $('.trigger button').on('click', function () {
    $('.animate-me .bar').css('width', 0).animate({
      width: '100%'
    }, {
      duration: 2000,
      start: function () {
        counter.find('.done').hide();
        setPercent(0);
      },
      progress: function (promise, progress, remainingTime) {
        var percent = Math.floor(progress * 100);
        setPercent(percent);
      },
      complete: function () {
        counter.find('.done').show();
      }
    });
  });
})(jQuery);