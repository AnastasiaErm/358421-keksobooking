'use strict';

(function () {

  window.utils = {
    // Возврат случайного элемента массива
    getRandomArrayElement: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    // Возврат случайного от min до max (включительно)
    getRandomIntegerElement: function (min, max) {
      return min + Math.floor(Math.random() * (max + 1 - min));
    },

    // Случайная длина массива
    getArrayStringsRandom: function (array) {
      return array.slice(window.utils.getRandomIntegerElement(0, array.length));
    },
    // удаление всех дочерних
    removeElementsChild: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };
})();
