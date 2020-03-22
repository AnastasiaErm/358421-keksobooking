'use strict';

(function () {
  var PIN_QUANTITY = 5;

  var filter = document.querySelector('.map__filters');
  var type = filter.querySelector('#housing-type');
  var price = filter.querySelector('#housing-price');
  var rooms = filter.querySelector('#housing-rooms');
  var guests = filter.querySelector('#housing-guests');
  var features = filter.querySelector('#housing-features');
  var filterElements = filter.querySelectorAll('select, input');

  var filteredData = [];
  var defaultData = [];

  var priceRange = {
    low: {
      MIN: 0,
      MAX: 10000
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50000,
      MAX: Infinity
    }
  };

  // фильтрация элементов формы
  var selectFilterElement = function (element, value, item) {
    return element.value === 'any' ? true : element.value === item[value].toString();
  };

  // фильтрация типа жилья
  var selectFilterType = function (item) {
    return selectFilterElement(type, 'type', item.offer);
  };

  // фильтрация цены на жилье
  var selectFilterPrice = function (item) {
    var priceValue = priceRange[price.value];
    return priceValue ? item.offer.price >= priceValue.MIN && item.offer.price <= priceValue.MAX : true;
  };

  // фильтрация числа комнат
  var selectFilterRooms = function (item) {
    return selectFilterElement(rooms, 'rooms', item.offer);
  };

  // фильтрация числа гостей
  var selectFilterGuests = function (item) {
    return selectFilterElement(guests, 'guests', item.offer);
  };

  // фильтрация числа преимуществ
  var selectFilterFeatures = function (item) {
    var checkedElements = features.querySelectorAll('input:checked');

    return Array.from(checkedElements).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  // фильтрация полей формы
  var filterFormFields = function () {
    filteredData = defaultData.slice();
    filteredData = filteredData.filter(selectFilterType);
    filteredData = filteredData.filter(selectFilterPrice);
    filteredData = filteredData.filter(selectFilterRooms);
    filteredData = filteredData.filter(selectFilterGuests);
    filteredData = filteredData.filter(selectFilterFeatures);
  };

  // обработчик, организующий фильтрацию полей формы
  var onFormElementChange = window.utils.debounce(function () {
    filterFormFields();
    window.card.removeAd();
    window.pins.disablePinsElement();
    window.map.create(filteredData.slice(0, PIN_QUANTITY));
  });

  // активация элементов формы
  var activateElements = function () {
    filterElements.forEach(function (item) {
      item.disabled = false;
    });
    filter.addEventListener('change', onFormElementChange);
  };

  // активация фильтра
  var activateFilter = function (data) {
    defaultData = data.slice();
    activateElements();
    return defaultData.slice(0, PIN_QUANTITY);
  };

  // деактивация элементов
  var disableElements = function () {
    filterElements.forEach(function (item) {
      item.disabled = true;
    });
    filter.removeEventListener('change', onFormElementChange);
  };

  // деактивация фильтра
  var disableFilter = function () {
    disableElements();
    filter.reset();
  };

  window.filter = {
    activate: activateFilter,
    disable: disableFilter
  };
})();
