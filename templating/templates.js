(function ($, Handlebars) {
  var $users = $('#users');
  var userUrl = 'users.json';

  Handlebars.registerHelper('addOne', function (val) {
    return val + 1;
  });

  Handlebars.registerHelper('add', function (val, num) {
    return val + num;
  });

  Handlebars.registerPartial('userHeader', '<h2 class="name">{{add @index 1}}/{{total}} {{name}}</h2>');

  var normalizeUrl = function (url) {
    if (url.substring(0, 4) != 'http') {
      return 'http://' + url;
    }
    return url;
  }

  var companyDefaults = {
    company: 'company'
  };

  Handlebars.registerHelper('companyList', function (context, options) {
    var data, companyTemplate, companyFn;
    if (options.data) {
      data = Handlebars.createFrame(options.data);
      companyTemplate = options.hash.company || companyDefaults.company;
      companyFn = Handlebars.compile('{{' + companyTemplate + '}}');
    }
    var out = '<ul class="companies">';
    for (var i = 0, ii = context.length; i < ii; i++) {
      var c = context[i];
      if (data) {
        data.website = normalizeUrl(c.website);
        data.company = companyFn(c);
      }
      out += '<li class="company">' + options.fn(context[i], { data: data }) + '</li>';
    }
    return out + '</ul>';
  });
  
  var addressStr = $('#address-template').html();
  Handlebars.registerPartial('address', addressStr);

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