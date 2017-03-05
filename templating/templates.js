(function ($, Handlebars) {
  var $users = $('#users');
  var userUrl = 'https://jsonplaceholder.typicode.com/users';

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