(function ($, Handlebars) {
  var $users = $('#users');
  var userUrl = 'users.json';

  Handlebars.registerHelper('addOne', function (val) {
    return val + 1;
  });

  Handlebars.registerHelper('add', function (val, num) {
    return val + num;
  });

  Handlebars.registerHelper('companyList', function (context, options) {
    var out = '<ul class="companies">';
    for (var i = 0, ii = context.length; i < ii; i++) {
      out += '<li class="company">' + options.fn(context[i]) + '</li>';
    }
    return out + '</ul>';
  });

  var templateStr = $('#users-template').html();
  var template = Handlebars.compile(templateStr);

  var setUsers = function (users) {
    var html = template({ users: users });
    $users.append(html);
  }

  $.get(userUrl, function (response) {
    setUsers(response);
  });
})(Zepto, Handlebars);