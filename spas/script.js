(function () {
  var todoTplElement = document.getElementById('todo-template')
    , todoTplString = todoTplElement.innerHTML
    , todoTpl = Handlebars.compile(todoTplString)
    , todoDataUrl = 'data/todos-$INDEX.json'
    , pageSize = 10
    , nextBtn = document.getElementById('next-page')
    , prevBtn = document.getElementById('prev-page')
    , todoEl
    , curPage
    , pageCounter;

  var render = function (page, todos) {
    if (!page) {
      page = 0;
    }

    if (!todoEl) {
      var els = document.getElementsByClassName('todo-body');
      if (!els || !els.length) {
        alert('Unable to find todo element, no place to render them');
        return;
      }
      todoEl = els[0];
    }
    if (!pageCounter) {
      var els = document.getElementsByClassName('page-num');
      if (!els || !els.length) {
        alert('Unable to find page counter element, no place to render it');
        return;
      }
      pageCounter = els[0];
    }
    curPage = page;
    todoEl.innerHTML = todoTpl({todos: todos});
    pageCounter.innerHTML = String(page + 1);
    if (!page) {
      prevBtn.setAttribute('disabled', "");
    } else {
      prevBtn.removeAttribute('disabled');
    }
    if (todos.length < pageSize) {
      nextBtn.setAttribute('disabled', "");
    } else {
      nextBtn.removeAttribute('disabled');
    }
  }

  var _todos = {};
  var handleState = function (page, data, skipState) {
    render(page, _todos[page]);
    if (!skipState) {
      history.pushState({
        page: page
      }, "Page " + (page + 1), '#' + (page + 1));
    }
  }
  var load = function (page, skipState) {
    if (_todos[page]) {
      handleState(page, _todos[page], skipState);
      return;
    }
    fetch(todoDataUrl.replace('$INDEX', page))
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        _todos[page] = data;
        handleState(page, data, skipState);
      });
  }

  nextBtn.addEventListener('click', function () {
    load(curPage + 1);
  });

  prevBtn.addEventListener('click', function () {
    load(curPage - 1);
  });

  window.onpopstate = function (ev) {
    var state = ev.state
      , page = state.page;

    load(page, true);
  }

  if (window.location.hash) {
    var page = window.location.hash.slice(1);
    load(parseInt(page) - 1, true);
  } else if (history.state && history.state.page) {
    load(history.state.page, true);
  } else { 
    load(0);
  }
})();