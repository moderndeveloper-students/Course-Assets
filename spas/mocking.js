(function () {
  var url = document.getElementById('url')
    , input = document.getElementById('input')
    , output = document.getElementById('output')
    , actions = document.getElementsByClassName('actions')[0]
    , getBtn = document.getElementById('get')
    , postBtn = document.getElementById('post')
    , putBtn = document.getElementById('put')
    , deleteBtn = document.getElementById('delete');

  var send = function (url, method, data) {
    if ((method == 'put' || method == 'post') && !data) {
      alert('Must provide data for a ' + method.toUpperCase() + ' request');
      return;
    } 
    var opts = {
      method: method.toUpperCase()
    };
    if (data && method != 'get') {
      opts.body = data;
      opts.headers = {
        "Content-Type": "application/json"
      }
    }
    fetch(url, opts)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        output.value = JSON.stringify(data, null, 2);
      });
  }

  actions.addEventListener('click', function (ev) {
    if (ev.srcElement.tagName == 'BUTTON') {
      var method = ev.srcElement.id;
      var data = input.value || null;
      send(url.value, method, data);
    }
  })
})();