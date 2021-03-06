'use strict';
(function () {

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var similarPinElement = document.querySelector('.map__pins');

  var adFormResetButton = document.querySelector('.form__reset');

  var disabledFieldset = document.querySelectorAll('fieldset');


  var mainPinData = {
    sizes: {
      WIDTH: 66,
      HEIGHT: 80
    },
    coordinates: {
      X: 600,
      Y: 375
    },
    verticalRange: {
      Y_MIN: 130,
      Y_MAX: 630
    }
  };

  // активировать теги fieldset
  var activateFieldset = function (fieldset) {
    fieldset.forEach(function (item) {
      item.disabled = false;
    });
  };

  // обработчик, вызывающий перевод страницы в активное состояние
  var onPinMainMouseUp = function () {
    activatePage();
  };

  // отрисовка меток на карте
  var createMapPins = function (data) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (item) {
      var pin = window.pins.renderPinElement(item);
      fragment.appendChild(pin);
    });
    similarPinElement.appendChild(fragment);
  };

  var onLoadSuccess = function (data) {
    createMapPins(window.filter.activate(data));
  };

  // обработчик при возникновении ошибки загрузк данных с сервера
  var onLoadError = function (message) {
    window.alert.createAlertElement(message);
  };

  // перевести страницу в активное состояние
  var activatePage = function () {
    window.backend.load(onLoadSuccess, onLoadError);
    map.classList.remove('map--faded');

    // убрать у тегов fieldset атрибут disabled
    activateFieldset(disabledFieldset);

    // удаление события mouseup
    mapPinMain.removeEventListener('mouseup', onPinMainMouseUp);

    window.form.activateForm();
  };

  // вычисление координаты главного пина
  var getPinMainCoordinates = function () {
    return {
      x: mapPinMain.offsetLeft + mainPinData.sizes.WIDTH / 2,
      y: mapPinMain.offsetTop + mainPinData.sizes.HEIGHT
    };
  };


  // главный пин в первоначальное состояние
  var getPinMainInitialize = function () {
    mapPinMain.style.left = mainPinData.coordinates.X + 'px';
    mapPinMain.style.top = mainPinData.coordinates.Y + 'px';

    // вычисление коорднат главного пина и запись в поле адреса
    window.form.setAddress(getPinMainCoordinates());

    mapPinMain.addEventListener('mouseup', onPinMainMouseUp);
  };

  // переключение страницы в первоначальное состояние
  var disablePageActive = function () {
    map.classList.add('map--faded');
    window.form.disableForm();
    window.pins.disablePinsElement();
    window.card.removeAd();
    window.filter.disable();
    getPinMainInitialize();
  };

  adFormResetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    disablePageActive();
  });

  // инициализация страницы
  var initializePage = function () {
    disablePageActive();
    // обработчик события mousedown
    mapPinMain.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      // функция-обработчик, перемещающая главный пин
      var onMouseMove = function (evtMove) {
        evtMove.preventDefault();

        var currentPosition = {
          x: startCoords.x - evtMove.clientX,
          y: startCoords.y - evtMove.clientY
        };

        var newPosition = {
          x: mapPinMain.offsetLeft - currentPosition.x,
          y: mapPinMain.offsetTop - currentPosition.y
        };

        if (newPosition.x >= mainPinData.sizes.WIDTH / 2 &&
          newPosition.x <= map.clientWidth - mainPinData.sizes.WIDTH / 2 &&
          newPosition.y >= mainPinData.verticalRange.Y_MIN &&
          newPosition.y <= mainPinData.verticalRange.Y_MAX) {

          mapPinMain.style.left = newPosition.x + 'px';
          mapPinMain.style.top = newPosition.y + 'px';

          window.form.setAddress(getPinMainCoordinates());
        }

        startCoords = {
          x: evtMove.clientX,
          y: evtMove.clientY
        };
      };

      // функция-обработчик прекращающаяя перемещение главного пина
      var onMouseUp = function (evtUp) {
        evtUp.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
    mapPinMain.addEventListener('mouseup', onPinMainMouseUp);
  };

  initializePage();
  window.map = {
    disablePageActive: disablePageActive,
    create: createMapPins
  };
})();
