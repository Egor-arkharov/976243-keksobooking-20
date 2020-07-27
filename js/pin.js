'use strict';

(function () {
  var MAX_PINS = 5;

  var main = document.querySelector('main');
  var mapPin = document.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content;

  var offsetX = (mapPin.getBoundingClientRect().width) / 2;
  var offsetY = mapPin.getBoundingClientRect().height;

  var formFilter = document.querySelector('.map__filters');

  var activePins = [];

  var renderPin = function (pin) {
    var newPin = pinTemplate.querySelector('.map__pin').cloneNode(true);

    var x = pin.location.x - offsetX;
    var y = pin.location.y - offsetY;
    newPin.style.left = x + 'px';
    newPin.style.top = y + 'px';

    var newAppartImg = newPin.querySelector('img');
    newAppartImg.src = pin.author.avatar;
    newAppartImg.alt = pin.offer.title;

    newPin.addEventListener('click', function () {
      window.map.hideActivePin();
      window.map.openPopup(pin);
      newPin.classList.add('map__pin--active');
    });

    return newPin;
  };

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();
    var takeNumber = pins.length > MAX_PINS ? MAX_PINS : pins.length;

    for (var i = 0; i < takeNumber; i++) {
      var adPin = renderPin(pins[i]);
      fragment.appendChild(adPin);
    }

    mapPins.appendChild(fragment);
  };

  var onFilterUpdate = function () {
    if (activePins.length !== 0) {
      removeErrorMessage();
    }

    removePopup();
    removeLastPins();

    window.debounce(renderPins(window.filter(activePins)));
  };

  var removePopup = function () {
    var popup = document.querySelector('.popup');

    if (popup) {
      popup.remove();
    }
  };

  var removeLastPins = function () {
    var lastPins = mapPins.querySelectorAll('.map__pin');

    for (var i = 0; i < lastPins.length; i++) {
      if (!lastPins[i].classList.contains('map__pin--main')) {
        lastPins[i].remove();
      }
    }
  };

  var removeErrorMessage = function () {
    var errorMessage = document.querySelector('.error__message');

    if (errorMessage) {
      errorMessage.remove();
    }
  };

  var activateFormFilter = function () {
    var formFilters = formFilter.children;

    for (var i = 0; i < formFilters.length; i++) {
      formFilters[i].removeAttribute('disabled', 'disabled');
    }
  };

  var successHandler = function (pins) {
    removeErrorMessage();
    activePins = pins;
    activateFormFilter();
    renderPins(pins);
  };

  var makeErrorMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.classList.add('error__message');
    node.textContent = errorMessage;

    return node;
  };

  var errorHandler = function (errorMessage) {
    removeErrorMessage();
    var message = makeErrorMessage(errorMessage);
    main.insertAdjacentElement('afterbegin', message);
  };

  formFilter.addEventListener('change', onFilterUpdate);

  window.pin = {
    successHandler: successHandler,
    errorHandler: errorHandler,
    removeErrorMessage: removeErrorMessage,
    removePopup: removePopup,
    removeLastPins: removeLastPins,
    formFilter: formFilter
  };

})();
