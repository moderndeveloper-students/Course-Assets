(function () {
  var viewContent = document.getElementById('view-content');
  var routes = [
    {
      path: 'quiz',
      template: 'quiz',
      handler: 'quiz'
    },
    {
      path: 'results',
      template: 'results',
      handler: 'results'
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

  var render = function (route, hash, data) {
    var tpl = getTemplate(route.template)
      , handler = handlers[route.handler];
    if (!handler) {
      viewContent.innerHTML = tpl();
    } else {
      handler(hash, function (data) {
        viewContent.innerHTML = tpl(data);
      }, data);
    }
  }

  var navigate = function (path, skipPush, data) {
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

    render(route, path, data);
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

    var bindToSubmit = function () {
      var quiz = data.quiz
        , questions = data.questions
        , btn = document.getElementById('submit-quiz');
      btn.addEventListener('click', function () {
        var form = document.quiz // get form by name
          , answers = [];
        for (var i = 0, ii = questions.length; i < ii; i++) {
          var q = questions[i]
            , questionId = q.id
            , answer = form['answer-' + questionId].value;

          answers.push({
            question: q,
            answer: answer
          });
        }
        navigate('results', false, { quiz: quiz, answers: answers, questions: questions })
      });
    }

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
          bindToSubmit();
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
          bindToSubmit();
        }
      });
  }

  handlers.results = function (hash, done, data) {
    if (!data) {
      error('Results page can only be loaded from a submitted quiz');
      return;
    }

    fetch('data/answers.json')
      .then(function (response) {
        return response.json()
      })
      .then(function (answers) {
        var questions = data.questions
          , userAnswers = data.answers
          , total = questions.length
          , correct = 0;

        // Augment question data with correct answer info
        for (var i = 0, ii = total; i < ii; i++) {
          var question = questions[i];

          question.correctAnswer = answers[question.id];
          question.userAnswer = _.find(userAnswers, function (a) {
            return a.question.id == question.id
          });

          question.correct = question.correctAnswer == question.userAnswer.answer;
          if (question.correct) {
            correct++;
          }
        }

        data.percent = (correct / total) * 100;
        done(data);
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