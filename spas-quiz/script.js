(function () {
  var viewContent = document.getElementById('view-content');
  var routes = [
    {
      path: 'quiz',
      template: 'quiz',
      handler: 'quiz'
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

  var error = function (message) {
    console.warn(message);
    navigate('/');
  }

  var route = function () {
    var hash = window.location.hash
      , path = hash.slice(1)
      , selectedRoute = match(path);

    if (!selectedRoute) {
      error('No route found matching "' + hash + '"');
      return;
    }

    render(selectedRoute, path);
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

  var navigate = function (path, skipPush) {
    var route = match(path);

    if (!route) {
      error('No route found matching "' + path + '"');
      return;
    }

    if (!skipPush) {
      history.pushState({
        route: route,
        path: path
      }, route.template, '#' + path);
    }

    render(route, path);
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
        var quizElements = document.getElementsByClassName('quiz');
        for (var i = 0, ii = quizElements.length; i < ii; i++) {
          var el = quizElements[i];

          el.addEventListener('click', function (ev) {
            var target = ev.currentTarget
              , quizId = target.getAttribute('data-id')
            navigate('quiz/' + quizId);
          });
        }
      });
  }

  handlers.quiz = function (hash, done) {
    var hashParts = hash.split('/')
      , quizId = hashParts[1] || false;

    if (!quizId) {
      error('Invalid route, quiz must have id');
      return;
    }

    var data = {};

    fetch('data/quizzes.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (quizzes) {
        data.quiz = _.find(quizzes, function (q) {
          return q.id == quizId;
        });
        if (!data.quiz) {
          error('Unable to find quiz matching id ' + quizId);
          return;
        }
        if (data.questions) {
          done(data);
        }
      });

    fetch('data/questions.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (questions) {
        data.questions = _.filter(questions, function (q) {
          return q.quizId == quizId;
        });
        if (!data.questions) {
          error('Unable to find questions for quiz ' + quizId);
          return;
        }
        if (data.quiz) {
          done(data);
        }
      });
  }

  window.onload = route;

  window.onpopstate = function (ev) {
    if (ev.state) {
      var path = ev.state.path;
    } else {
      var hash = window.location.hash
        , path = hash.slice(1);
    }
    navigate(path, true);
  };
})();