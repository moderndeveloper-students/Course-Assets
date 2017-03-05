(function ($, Handlebars) {
  var userUrl = 'https://jsonplaceholder.typicode.com/users';

  var template = [
    '<div class="user">',
      '<h2 class="name">$NAME</h2>',
      '<div class="address">',
        '<p class="street">$SUITE $STREET</p>',
        '<p class="city-zip">$CITY, $ZIPCODE</p>',
      '</div>',
    '</div>'
  ].join("\r\n");

  var $users = $('#users');

  var setUsers = function (users) {
    for (var i = 0, ii = users.length; i < ii; i++) {
      var user = users[i];
      var html = template
        .replace('$NAME', user.name)
        .replace('$SUITE', user.address.suite)
        .replace('$STREET', user.address.street)
        .replace('$CITY', user.address.city)
        .replace('$ZIPCODE', user.address.zipcode);

      $users.append(html);
    }
  }

  $.get(userUrl, function (response) {
    setUsers(response);
  });
})(Zepto, Handlebars);