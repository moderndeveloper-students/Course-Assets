(function ($) {
  var datepickers = $('.datepicker');

  var bday = datepickers.filter('[name="birthday"]')
    .datepicker({
      maxDate: '-5y',
      dateFormat: 'M dd, yy'
    });

  var hs = datepickers.filter('[name="high-school"]').datepicker();

  bday.datepicker('option', 'onSelect', function (dateText) {
    var date = $.datepicker.parseDate('M dd, yy', dateText)
      , currentYear = date.getFullYear()
      , minYear = currentYear + 5;

    date.setFullYear(minYear);

    hs.datepicker('option', 'minDate', date);
  });
})(jQuery);