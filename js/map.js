'use strict';
(function () {
  var ADS_AMOUNT = 8;

  var mainPinData = {
    sizes: {
      WIDTH: 65,
      HEIGHT: 80
    },
    coordinates: {
      X: 570,
      Y: 375
    }
  };

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var similarPinElement = document.querySelector('.map__pins');

  var disabledFieldset = document.querySelectorAll('fieldset');
  // создание массива из n объявлений
  var getEstateAds = function () {
    var estateAds = [];
    for (var i = 0; i < ADS_AMOUNT; i++) {
      estateAds.push(window.getEstateData(i));
    }
    return estateAds;
  };

  // активировать теги fieldset
  var activateFieldsets = function (fieldset) {
    fieldset.forEach(function (item) {
      item.disabled = false;
    });
  };

  // обработчик, вызывающий перевод страницы в активное состояние
  var onPinMainMouseUp = function () {
    activatePage();
  };

  // перевести страницу в активное состояние
  var activatePage = function () {
    map.classList.remove('map--faded');

    // убрать у тегов fieldset атрибут disabled
    activateFieldsets(disabledFieldset);

    var estateData = getEstateAds();
    similarPinElement.appendChild(window.pins.renderPinsElement(estateData));

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
    getPinMainInitialize();
  };

  // инициализация страницы
  var initializePage = function () {
    disablePageActive();
    mapPinMain.addEventListener('mouseup', onPinMainMouseUp);
  };

  initializePage();
})();
