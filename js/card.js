'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var template = document.querySelector('template');
  var adTemplate = template.content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var similarAdElement = document.querySelector('.map__filters-container');

  var translationEstateTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var configPhotoElement = {
    CLASS: 'popup__photo',
    WIDTH: 45,
    HEIGHT: 40,
    ALT: 'Фотография жилья'
  };

  var adActive;

  // создание преимуществ
  var createFeatureElement = function (modifier) {
    var newElementFeature = document.createElement('li');
    newElementFeature.classList.add('feature', 'feature--' + modifier);
    return newElementFeature;
  };

  // создание нового изображения
  var createPhotoElement = function (pathPhoto) {
    var newElementPhoto = document.createElement('img');
    newElementPhoto.classList.add(configPhotoElement.CLASS);
    newElementPhoto.src = pathPhoto;
    newElementPhoto.style.width = configPhotoElement.WIDTH + 'px';
    newElementPhoto.style.height = configPhotoElement.HEIGHT + 'px';
    newElementPhoto.alt = configPhotoElement.ALT;
    return newElementPhoto;
  };

  // создание объявления о недвижимости
  var createAdElement = function (ad) {
    var adElement = adTemplate.cloneNode(true);
    var adClose = adElement.querySelector('.popup__close');

    adElement.querySelector('.popup__title').textContent = ad.offer.title;
    adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    adElement.querySelector('.popup__type').textContent = translationEstateTypes[ad.offer.type];
    adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresParent = adElement.querySelector('.popup__features');
    window.utils.removeElementsChild(featuresParent);

    ad.offer.features.forEach(function (item) {
      featuresParent.appendChild(createFeatureElement(item));
    });

    adElement.querySelector('.popup__description').textContent = ad.offer.description;
    var photoParent = adElement.querySelector('.popup__photos');
    window.utils.removeElementsChild(photoParent);
    ad.offer.photos.forEach(function (item) {
      photoParent.appendChild(createPhotoElement(item));
    });
    adElement.querySelector('.popup__avatar').src = ad.author.avatar;

    // обработчик события click
    adClose.addEventListener('click', window.card.removeAd);

    // обработчик события keydown
    document.addEventListener('keydown', onAdCloseEsc);

    return adElement;
  };

  // обработчик закрытия объявления при нажатии на ESC
  var onAdCloseEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.removeAd();
    }
  };

  // скрытие объявления
  var hideAd = function () {
    if (adActive) {
      adActive.remove();
    }
  };

  window.card = {
    // показать объявление
    showFullAd: function (element) {
      hideAd();
      adActive = map.insertBefore(createAdElement(element), similarAdElement);
    },
    // скрытия объявления
    removeAd: function () {
      hideAd();
      window.pins.hideActivePin();
      document.removeEventListener('keydown', onAdCloseEsc);
    }
  };
})();
