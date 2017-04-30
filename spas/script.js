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

  var render = function (page) {
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
  }

  fetch(todoDataUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      todos = data;
      render();
    });

  nextBtn.addEventListener('click', function () {
    render(curPage + 1);
  });

  prevBtn.addEventListener('click', function () {
    render(curPage - 1);
  });
})();