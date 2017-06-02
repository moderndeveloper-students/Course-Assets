(function () {
  var viewContent = document.getElementById('view-content');
  var routes = [
    {
      path: 'quiz',
      template: 'quiz',
      handler: 'noop'
    },
    {
      path: '*',
      template: 'welcome',
      handler: 'welcome'
    }
  ]

  var handlers = {
    noop: function () {}
  };

  var route = function () {
    var hash = window.location.hash
      , selectedRoute = match(hash);

    if (!selectedRoute) {
      throw 'No route found matching "' + hash + '"';
    }

    render(selectedRoute, hash);
  }

  var match = function (path) {
    var defaultRoute;
    for (var i = 0, ii = routes.length; i < ii; i++) {
      var r = routes[i]
        , p = r.path;
      if (path.indexOf(p) === 0) {
        return r;
      } else if (p === '*') {
        defaultRoute = r;
      }
    }
    return defaultRoute;
  }

  var render = function (route, hash) {
    var tpl = getTemplate(route.template)
      , handler = handlers[route.handler];
    if (!handler) {
      viewContent.innerHTML = tpl();
    } else {
      handler(hash, function (data) {
        viewContent.innerHTML = tpl(data);
      });
    }
  }

  var getTemplate = function (tplName) {
    var tplElement = document.getElementById(tplName + '-template')
      , tplString = tplElement.innerHTML
      , tpl = Handlebars.compile(tplString);

    return tpl;
  }

  handlers.welcome = function (hash, done) {
    fetch('data/quizzes.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (quizzes) {
        done({
          quizzes: quizzes
        });
      });
  }

  window.onload = route;
})();