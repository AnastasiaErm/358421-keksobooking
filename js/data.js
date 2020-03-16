'use strict';

(function () {
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

  var authorData = {
    AVATARS: 'img/avatars/user'
  };

  // Возврат пути аватара
  var getPathAvatar = function (number) {
    var avatarNumber = number > 9 ? number : '0' + number;
    return authorData.AVATARS + avatarNumber + '.png';
  };

  // Сгенерированные данные объекта недвижимости
  window.getEstateData = function (index) {
    var locationX = window.utils.getRandomIntegerElement(realEstateData.location.X_MIN, realEstateData.location.X_MAX);
    var locationY = window.utils.getRandomIntegerElement(realEstateData.location.Y_MIN, realEstateData.location.Y_MAX);
    return {
      author: {
        avatar: getPathAvatar(index + 1)
      },
      offer: {
        title: realEstateData.TITLES[index],
        address: locationX + ', ' + locationY,
        price: window.utils.getRandomIntegerElement(realEstateData.price.MIN, realEstateData.price.MAX),
        type: window.utils.getRandomArrayElement(realEstateData.TYPES),
        rooms: window.utils.getRandomIntegerElement(realEstateData.rooms.MIN, realEstateData.rooms.MAX),
        guests: window.utils.getRandomIntegerElement(realEstateData.guests.MIN, realEstateData.guests.MAX),
        checkin: window.utils.getRandomArrayElement(realEstateData.CHECKIN_CHECKOUT),
        checkout: window.utils.getRandomArrayElement(realEstateData.CHECKIN_CHECKOUT),
        features: window.utils.getArrayStringsRandom(realEstateData.FEATURES),
        description: '',
        photos: realEstateData.PHOTOS
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  };
})();
