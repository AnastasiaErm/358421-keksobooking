'use strict';

(function () {
  var roomForGuests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };

  var estateTypeMinPrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var noticeForm = document.querySelector('.notice__form');

  var inputAddress = noticeForm.querySelector('#address');

  var adRoomNumber = noticeForm.querySelector('#room_number');

  var adCapacity = noticeForm.querySelector('#capacity');

  var adCapacityOptions = adCapacity.querySelectorAll('option');

  var adType = noticeForm.querySelector('#type');

  var adPrice = noticeForm.querySelector('#price');

  var adTimeIn = noticeForm.querySelector('#timein');

  var adTimeOut = noticeForm.querySelector('#timeout');

  var adTitle = noticeForm.querySelector('#title');

  var fieldsets = document.querySelectorAll('fieldset');

  var invalidFields = [];


  //  установка соответствия количества гостей количеству комнат
  var getNumberGuests = function () {
    var selectedOption = roomForGuests[adRoomNumber.value];

    adCapacityOptions.forEach(function (item) {
      item.disabled = !selectedOption.includes(item.value);
    });

    adCapacity.value = selectedOption.includes(adCapacity.value) ? adCapacity.value : selectedOption[0];
  };

  // обработчик соответствия количества гостей количеству комнат
  var onSelectRoomChange = function () {
    getNumberGuests();
  };

  // обработчик события change
  adRoomNumber.addEventListener('change', onSelectRoomChange);

  // ограничение минимальной цены
  var setPriceType = function () {
    adPrice.min = estateTypeMinPrices[adType.value];
    adPrice.placeholder = adPrice.min;
  };

  // обработчик ограничение минимальной цены
  var onInputAdTypeChange = function () {
    setPriceType();
  };

  // обработчик события change
  adType.addEventListener('change', onInputAdTypeChange);

  // установка значения выбранного элемента
  var setElementValue = function (element, evt) {
    element.value = evt.target.value;
  };

  // обработчик синхронизирующий время выезда и заезда
  var onInputTimeOutChange = function (evt) {
    setElementValue(adTimeIn, evt);
  };

  // обработчик события change
  adTimeOut.addEventListener('change', onInputTimeOutChange);

  // обработчик синхронизирующий время заезд и выезд
  var onInputTimeInChange = function (evt) {
    setElementValue(adTimeOut, evt);
  };

  // обработчик события change
  adTimeIn.addEventListener('change', onInputTimeInChange);

  // выделить невалидное поле
  var getInvalidFieldForm = function (field) {
    field.parentNode.classList.add('form__element--invalid');
    invalidFields.push(field);
  };

  // снять выделение невалидного поля
  var removeInvalidFieldForm = function (field) {
    field.parentNode.classList.remove('form__element--invalid');
    invalidFields.splice(invalidFields.indexOf(field), 1);
  };

  // проверить валидность поля
  var checkValidFieldForm = function (evt) {
    if (!evt.target.checkValidity()) {
      getInvalidFieldForm(evt.target);
    } else if (invalidFields.indexOf(evt.target) !== -1) {
      removeInvalidFieldForm(evt.target);
    }
  };

  // Обработчик проверки валидности поля формы
  var onInputFieldValidity = function (evt) {
    checkValidFieldForm(evt);
  };

  // обработчик события change
  adTitle.addEventListener('change', onInputFieldValidity);

  adPrice.addEventListener('change', onInputFieldValidity);


  // деактивировать теги fieldset
  var disableFieldsets = function (fieldset) {
    fieldset.forEach(function (item) {
      item.disabled = true;
    });
  };

  window.form = {
    activateForm: function () {
      noticeForm.classList.remove('notice__form--disabled');

      noticeForm.addEventListener('invalid', function (evt) {
        getInvalidFieldForm(evt.target);
      }, true);
    },
    // деактивировать форму
    disableForm: function () {
      noticeForm.reset();

      noticeForm.classList.add('notice__form--disabled');

      disableFieldsets(fieldsets);

      onInputAdTypeChange();

      invalidFields.forEach(function (field) {
        field.parentNode.classList.remove('notice__form--invalid');
      });
    },
    // запись координаты главного пина в поле адреса
    setAddress: function (coordinates) {
      inputAddress.value = coordinates.x + ', ' + coordinates.y;
    },
  };
})();
