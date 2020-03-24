'use strict';

(function () {
  var DEFAULT_SRC = 'img/muffin.png';

  var adForm = document.querySelector('.notice__form');
  var avatarPreview = adForm.querySelector('.notice__preview img');
  var avatar = adForm.querySelector('#avatar');

  var photoPreviewContainer = adForm.querySelector('.form__photo-container');
  var photoPreview = adForm.querySelector('.form__photo');
  var photo = adForm.querySelector('#images');

  var fileData = {
    WIDTH: '70',
    HEIGHT: '70',
    BORDER: 'border-radius: 5px;',
    TYPES: ['gif', 'jpg', 'jpeg', 'png']
  };

  var photos = [];

  var createAvatarInput = function (src) {
    avatarPreview.src = src;
  };

  // DOM-элемент поля фотографии
  var createPhotoInput = function (src) {
    var photoCloneNode = photoPreview.cloneNode();
    var image = document.createElement('img');
    image.src = src;
    image.width = fileData.WIDTH;
    image.height = fileData.HEIGHT;
    image.style = fileData.BORDER;
    photos.push(image);
    photoCloneNode.appendChild(image);
    photoPreviewContainer.insertBefore(photoCloneNode, photoPreview);
  };

  // загрузка файла
  var loadFile = function (evt, callback) {
    if (evt.files) {
      Array.from(evt.files).forEach(function (file) {
        if (file.type.match('image')) {
          var fileReader = new FileReader();

          fileReader.addEventListener('load', function () {
            callback(fileReader.result);
          });

          fileReader.readAsDataURL(file);
        } else {
          evt.value = '';
        }
      });
    }
  };

  // обработчик, загружающий аватарку пользователя
  var onInputAvatarChange = function (evt) {
    loadFile(evt.target, createAvatarInput);
  };

  // обработчик, загружающий фотографии недвижимости
  var onInputPhotoChange = function (evt) {
    loadFile(evt.target, createPhotoInput);
  };

  // сброс загруженных файлов
  var resetInputFile = function () {
    photos.forEach(function (item) {
      item.parentElement.remove();
    });
    avatarPreview.src = DEFAULT_SRC;
  };

  // добавляем сгруппированные события
  var add = function () {
    avatar.addEventListener('change', onInputAvatarChange);
    photo.addEventListener('change', onInputPhotoChange);
  };

  // удаляем сгруппированные события
  var remove = function () {
    resetInputFile();
    avatar.removeEventListener('change', onInputAvatarChange);
    photo.removeEventListener('change', onInputPhotoChange);
  };

  window.image = {
    add: add,
    remove: remove
  };
})();
