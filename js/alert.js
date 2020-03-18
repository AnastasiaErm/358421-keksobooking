'use strict';

(function () {
  var TIMEOUT = 5000;

  var createAlert = function (message) {
    var divElement = document.createElement('div');
    divElement.style = 'z-index: 1;';
    divElement.style.position = 'absolute';
    divElement.style.fontSize = '15px';
    divElement.style.padding = '10px';

    divElement.style.backgroundColor = message ? 'red' : 'green';
    divElement.textContent = message ? message : 'Данные успешно отправлены';

    document.body.insertAdjacentElement('afterbegin', divElement);
    setTimeout(function () {
      divElement.remove();
    }, TIMEOUT);

  };
  window.alert = {
    createAlertElement: createAlert
  };
})();
