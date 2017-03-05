(function ($, Handlebars) {
  var $users = $('#users');
  var userUrl = 'https://jsonplaceholder.typicode.com/users';

  var template = Handlebars.compile([
    '{{#each users}}',
    '<div class="user">',
      '<h2 class="name">{{name}}</h2>',
      '<div class="address">',
        '<p class="street">{{address.suite}} {{address.street}}</p>',
        '<p class="city-zip">{{address.city}}, {{address.zipcode}}</p>',
      '</div>',
    '</div>',
    '{{/each}}'
  ].join("\r\n"));

  var setUsers = function (users) {
    var html = template({ users: users });
    $users.append(html);
  }

  $.get(userUrl, function (response) {
    setUsers(response);
  });
})(Zepto, Handlebars);