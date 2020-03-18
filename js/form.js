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

  // ограничение минимальной цены
  var setPriceType = function () {
    adPrice.min = estateTypeMinPrices[adType.value];
    adPrice.placeholder = adPrice.min;
  };

  // обработчик ограничение минимальной цены
  var onInputAdTypeChange = function () {
    setPriceType();
  };

  // установка значения выбранного элемента
  var setElementValue = function (element, evt) {
    element.value = evt.target.value;
  };

  // обработчик синхронизирующий время выезда и заезда
  var onInputTimeOutChange = function (evt) {
    setElementValue(adTimeIn, evt);
  };

  // обработчик синхронизирующий время заезд и выезд
  var onInputTimeInChange = function (evt) {
    setElementValue(adTimeOut, evt);
  };

  // выделить невалидное поле
  var getInvalidFieldForm = function (field) {
    field.parentNode.classList.add('form__element--invalid');
    invalidFields.push(field);
  };

  // обработчик валидности формы
  var onInvalidForm = function (evt) {
    getInvalidFieldForm(evt.target);
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


  // деактивировать теги fieldset
  var disableFieldset = function (fieldset) {
    fieldset.forEach(function (item) {
      item.disabled = true;
    });
  };

  // обработчик успешной отправки данных формы
  var onUploadDataSuccess = function () {
    window.map.disablePageActive();
    window.alert.createAlertElement();
  };

  // обработчик при ошибки отправки данных формы
  var onUploadDataError = function (message) {
    window.alert.createAlertElement(message);
  };

  // обработчик отправки данных на сервер
  var onFormSubmitClick = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(noticeForm), onUploadDataSuccess, onUploadDataError);
  };

  // добавить обработчики
  var addFormListeners = function () {
    adRoomNumber.addEventListener('change', onSelectRoomChange);
    adType.addEventListener('change', onInputAdTypeChange);
    adTimeOut.addEventListener('change', onInputTimeOutChange);
    adTimeIn.addEventListener('change', onInputTimeInChange);
    adTitle.addEventListener('change', onInputFieldValidity);
    adPrice.addEventListener('change', onInputFieldValidity);
    noticeForm.addEventListener('submit', onFormSubmitClick);
    noticeForm.addEventListener('invalid', onInvalidForm, true);
  };

  // удалить обработчики
  var removeFormListeners = function () {
    adRoomNumber.removeEventListener('change', onSelectRoomChange);
    adType.removeEventListener('change', onInputAdTypeChange);
    adTimeOut.removeEventListener('change', onInputTimeOutChange);
    adTimeIn.removeEventListener('change', onInputTimeInChange);
    adTitle.removeEventListener('change', onInputFieldValidity);
    adPrice.removeEventListener('change', onInputFieldValidity);
    noticeForm.removeEventListener('submit', onFormSubmitClick);
    noticeForm.removeEventListener('invalid', onInvalidForm, true);
  };


  window.form = {
    // активировать форму
    activateForm: function () {
      noticeForm.classList.remove('notice__form--disabled');
      addFormListeners();
    },
    // деактивировать форму
    disableForm: function () {
      noticeForm.reset();

      noticeForm.classList.add('notice__form--disabled');

      disableFieldset(fieldsets);

      onInputAdTypeChange();

      invalidFields.forEach(function (field) {
        field.parentNode.classList.remove('notice__form--invalid');
      });
      removeFormListeners();
    },
    // запись координаты главного пина в поле адреса
    setAddress: function (coordinates) {
      inputAddress.value = coordinates.x + ', ' + coordinates.y;
    },
  };
})();
