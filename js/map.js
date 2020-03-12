'use strict';

var ESC_KEYCODE = 27;

var ADS_AMOUNT = 8;

var authorData = {
  AVATARS: 'img/avatars/user'
};

var mainPinSize = {
  WIDTH: 62,
  HEIGHT: 80
};

var pinSize = {
  WIDTH: 50,
  HEIGHT: 70
};

var configPhotoElement = {
  CLASS: 'popup__photo',
  WIDTH: 45,
  HEIGHT: 40,
  ALT: 'Фотография жилья'
};

var realEstateData = {
  location: {
    X_MIN: 300,
    X_MAX: 900,
    Y_MIN: 130,
    Y_MAX: 630
  },
  price: {
    MIN: 1000,
    MAX: 1000000
  },
  rooms: {
    MIN: 1,
    MAX: 5
  },
  guests: {
    MIN: 1,
    MAX: 25
  },
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  TYPES: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  CHECKIN_CHECKOUT: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

var translationEstateTypes = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

var adActive;
var pinActive;

var map = document.querySelector('.map');

var template = document.querySelector('template');
var adTemplate = template.content.querySelector('.map__card');
var mapPinTemplate = template.content.querySelector('.map__pin');

var similarPinElement = document.querySelector('.map__pins');
var similarAdElement = document.querySelector('.map__filters-container');

var mapPinMain = document.querySelector('.map__pin--main');

var noticeForm = document.querySelector('.notice__form');

var fieldsets = document.querySelectorAll('fieldset');

var inputAddress = noticeForm.querySelector('#address');

// Возврат случайного элемента массива
var getRandomArrayElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// Возврат случайного от min до max (включительно)
var getRandomIntegerElement = function (min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
};

// Возврат пути аватара
var getPathAvatar = function (number) {
  var avatarNumber = number > 9 ? number : '0' + number;
  return authorData.AVATARS + avatarNumber + '.png';
};

// Случайная длина массива
var getArrayStringsRandom = function (array) {
  return array.slice(getRandomIntegerElement(0, array.length));
};

// Сгенерированные данные объекта недвижимости
var getEstateData = function (index) {
  var locationX = getRandomIntegerElement(realEstateData.location.X_MIN, realEstateData.location.X_MAX);
  var locationY = getRandomIntegerElement(realEstateData.location.Y_MIN, realEstateData.location.Y_MAX);
  return {
    author: {
      avatar: getPathAvatar(index + 1)
    },
    offer: {
      title: realEstateData.TITLES[index],
      address: locationX + ', ' + locationY,
      price: getRandomIntegerElement(realEstateData.price.MIN, realEstateData.price.MAX),
      type: getRandomArrayElement(realEstateData.TYPES),
      rooms: getRandomIntegerElement(realEstateData.rooms.MIN, realEstateData.rooms.MAX),
      guests: getRandomIntegerElement(realEstateData.guests.MIN, realEstateData.guests.MAX),
      checkin: getRandomArrayElement(realEstateData.CHECKIN_CHECKOUT),
      checkout: getRandomArrayElement(realEstateData.CHECKIN_CHECKOUT),
      features: getArrayStringsRandom(realEstateData.FEATURES),
      description: '',
      photos: realEstateData.PHOTOS
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

// создание массива из n объявлений
var getEstateAds = function () {
  var estateAds = [];
  for (var i = 0; i < ADS_AMOUNT; i++) {
    estateAds.push(getEstateData(i));
  }
  return estateAds;
};

// удаление всех дочерних
var removeElementsChild = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

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

// скрытие объявления
var hideAd = function () {
  if (adActive) {
    adActive.remove();
  }
};

// снятие выделения активной точки
var removeActivePin = function () {
  if (pinActive) {
    pinActive.classList.remove('map__pin--active');
  }
};

// Обработчик скрытия объявления
var onElementAction = function () {
  hideAd();
  removeActivePin();
  document.removeEventListener('keydown', onAdCloseEsc);
};

// обработчик закрытия объявления при нажатии на ESC
var onAdCloseEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onElementAction();
  }
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
  removeElementsChild(featuresParent);

  ad.offer.features.forEach(function (item) {
    featuresParent.appendChild(createFeatureElement(item));
  });

  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  var photoParent = adElement.querySelector('.popup__photos');
  removeElementsChild(photoParent);
  ad.offer.photos.forEach(function (item) {
    photoParent.appendChild(createPhotoElement(item));
  });
  adElement.querySelector('.popup__avatar').src = ad.author.avatar;

  // обработчик события click
  adClose.addEventListener('click', onElementAction);

  // обработчик события keydown
  document.addEventListener('keydown', onAdCloseEsc);

  return adElement;
};

var showFullAd = function (element) {
  hideAd();
  adActive = map.insertBefore(createAdElement(element), similarAdElement);
};

var activatePin = function (element) {
  removeActivePin();
  pinActive = element;
  pinActive.classList.add('map__pin--active');
};

// создать метку
var createPinElement = function (pin) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (pin.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (pin.location.y - pinSize.HEIGHT) + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  pinElement.addEventListener('click', function () {
    showFullAd(pin);
    activatePin(pinElement);
  });
  return pinElement;
};

// отрисовка меток
var renderPinElement = function (pins) {
  var fragment = document.createDocumentFragment();
  pins.forEach(function (item) {
    fragment.appendChild(createPinElement(item));
  });
  return fragment;
};

// деактивировать теги fieldset
var disableFieldsets = function (fieldset) {
  fieldset.forEach(function (item) {
    item.disabled = true;
  });
};

// активировать теги fieldset
var enableFieldsets = function (fieldset) {
  fieldset.forEach(function (item) {
    item.disabled = false;
  });
};

// запись координаты главного пина в поле адреса
var setAddress = function (coordinates) {
  inputAddress.value = coordinates.x + ', ' + coordinates.y;
};

// вычисление координаты главного пина
var getPinMainCoordinates = function () {
  return {
    x: mapPinMain.offsetLeft + mainPinSize.WIDTH / 2,
    y: mapPinMain.offsetTop + mainPinSize.HEIGHT
  };
};

// обработчик, вызывающий перевод страницы в активное состояние
var onPinMainMouseup = function () {
  activatePage();
};

// перевести страницу в активное состояние
var activatePage = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');

  enableFieldsets(fieldsets);

  var estateData = getEstateAds();
  similarPinElement.appendChild(renderPinElement(estateData));

  // удаление события mouseup
  mapPinMain.removeEventListener('mouseup', onPinMainMouseup);

  // вычисление коорднат главного пина и запись в поле адреса
  setAddress(getPinMainCoordinates());

};

// инициализация страницы
var initializePage = function () {
  disableFieldsets(fieldsets);
  mapPinMain.addEventListener('mouseup', onPinMainMouseup);
};

initializePage();