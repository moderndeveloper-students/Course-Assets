(function () {
  var todoTplElement = document.getElementById('todo-template')
    , todoTplString = todoTplElement.innerHTML
    , todoTpl = Handlebars.compile(todoTplString)
    , todoDataUrl = 'data/todos.json'
    , pageSize = 10
    , nextBtn = document.getElementById('next-page')
    , prevBtn = document.getElementById('prev-page')
    , todos
    , todoEl
    , curPage
    , pageCounter;

  var render = function (page, skipState) {
    if (!page) {
      page = 0;
    }
    var start = page * pageSize
      , end = start + pageSize
      , todosToRender = todos.slice(start, end);

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
    todoEl.innerHTML = todoTpl({todos: todosToRender});
    pageCounter.innerHTML = String(page + 1);
    if (!page) {
      prevBtn.setAttribute('disabled', "");
    } else {
      prevBtn.removeAttribute('disabled');
    }
    if (todosToRender.length < pageSize) {
      nextBtn.setAttribute('disabled', "");
    } else {
      nextBtn.removeAttribute('disabled');
    }
    if (!skipState) {
      history.pushState({
        page: page
      }, "Page " + (page + 1), '#' + (page + 1));
    }
  }

  fetch(todoDataUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      todos = data;
      if (window.location.hash) {
        var page = window.location.hash.slice(1);
        render(parseInt(page) - 1, true);
      } else if (history.state && history.state.page) {
        render(history.state.page, true);
      } else { 
        render();
      }
    });

  nextBtn.addEventListener('click', function () {
    render(curPage + 1);
  });

  prevBtn.addEventListener('click', function () {
    render(curPage - 1);
  });

  window.onpopstate = function (ev) {
    var state = ev.state
      , page = state.page;

    render(page, true);
  }
})();