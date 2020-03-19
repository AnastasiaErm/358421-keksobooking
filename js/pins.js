'use strict';

(function () {
  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var mapPins = [];

  var pinActive;

  var template = document.querySelector('template');

  var mapPinTemplate = template.content.querySelector('.map__pin');

  var similarPinElement = document.querySelector('.map__pins');

  // выделение активной точки
  var activatePin = function (element) {
    window.pins.hideActivePin();
    pinActive = element;
    pinActive.classList.add('map__pin--active');
  };

  window.pins = {
    // отрисовка меток
    renderPinElement: function (pin) {
      var pinElement = mapPinTemplate.cloneNode(true);
      pinElement.style = 'left: ' + (pin.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (pin.location.y - pinSize.HEIGHT) + 'px';
      pinElement.querySelector('img').src = pin.author.avatar;
      pinElement.querySelector('img').alt = pin.offer.title;

      pinElement.addEventListener('click', function () {
        window.card.showFullAd(pin);
        activatePin(pinElement);
      });
      mapPins.push(pinElement);

      return pinElement;
    },
    // снятие выделения активной точки
    hideActivePin: function () {
      if (pinActive) {
        pinActive.classList.remove('map__pin--active');
      }
    },
    disablePinsElement: function () {
      mapPins.forEach(function (item) {
        similarPinElement.removeChild(item);
      });
      mapPins = [];
    }
  };
})();
