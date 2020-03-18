'use strict';

(function () {
  var urlTypes = {
    POST: 'https://js.dump.academy/keksobooking/',
    GET: 'https://js.dump.academy/keksobooking/data'
  };
  var statusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
  };

  var TIMEOUT = 10000;

  var processServerResponse = function (xhr, method, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.open(method, urlTypes[method]);

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case statusCode.OK:
          onLoad(xhr.response);
          break;
        case statusCode.BAD_REQUEST:
          onError('Сервер не смог обработать запрос. Повторите запрос позже');
          break;
        case statusCode.NOT_FOUND:
          onError('Запрашиваемая страница не найдена. Проверьте корректность введенного адреса');
          break;
        case statusCode.INTERNAL_SERVER:
          onError('Сервер не отвечает. Повторите запрос позже.');
          break;
        default:
          onError('В процессе загрузки произошла ошибка соединения: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения! Проверьте соединение с интернетом');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не выполнился за ' + xhr.timeout + 'мс');
    });
  };

  var uploadData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    processServerResponse(xhr, 'POST', onLoad, onError);
    xhr.send(data);
  };

  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    processServerResponse(xhr, 'GET', onLoad, onError);
    xhr.send();
  };

  window.backend = {
    save: uploadData,
    load: loadData
  };
})();
