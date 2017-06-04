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

  var route = function () {
    var hash = window.location.hash
      , path = hash.slice(1)
      , selectedRoute = match(path);

    if (!selectedRoute) {
      throw 'No route found matching "' + hash + '"';
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

  handlers.quiz = function (hash, done) {
    var hashParts = hash.split('/')
      , quizId = hashParts[1] || false;

    if (!quizId) {
      throw 'Invalid route, quiz must have id';
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
          throw 'Unable to find quiz matching id ' + quizId;
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
          throw 'Unable to find questions for quiz ' + quizId;
        }
        if (data.quiz) {
          done(data);
        }
      });
  }

  window.onload = route;
})();