import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY, TYPES, EditType} from '../const.js';
import {getScheduleDate, capitalizeFirstLetter} from '../utils/point.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const ButtonLabel = {
  CANCEL_DEFAULT: 'Cancel',
  DELETE_DEFAULT: 'Delete',
  DELETE_IN_PROGRESS: 'Deleting...',
  SAVE_DEFAULT: 'Save',
  SAVE_IN_PROGRESS: 'Saving...',
};

function createCancelDeleteButton ({type, isDeleting, isDisabled}) {
  let label;

  if (type === EditType.CREATING) {
    label = ButtonLabel.CANCEL_DEFAULT;
  } else {
    label = isDeleting ? ButtonLabel.DELETE_IN_PROGRESS : ButtonLabel.DELETE_DEFAULT;
  }

  /* html */
  return `
    <button class="event__reset-btn" type="reset" ${(isDisabled) ? 'disabled' : ''}>${label}</button>
  `;
}

function createSaveButton ({isSaving, isDisabled}) {
  const label = isSaving ? ButtonLabel.SAVE_IN_PROGRESS : ButtonLabel.SAVE_DEFAULT;

  /* html */
  return `
    <button class="event__save-btn btn btn--blue" type="submit" ${(isDisabled) ? 'disabled' : ''}>${label}</button>
  `;
}

function pointEditControls ({type, point, isSaving, isDeleting, isDisabled}) {
  /* html */
  return `
    ${createSaveButton({isSaving, isDisabled})}
    ${createCancelDeleteButton({type, isDeleting, isDisabled})}
    ${!point.id ? '' : /* html */ `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Close event</span></button>`}
  `;
}

function showDestinationPhotos (photos) {
  /* html */
  return photos.map(({description, src}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('');
}

function showDestinationDescription (description) {
  /* html */
  return `
    <p class="event__destination-description">${description}</p>
  `;
}

function showDestinationDescriptionPhotos (pointDestination) {
  /* html */
  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${showDestinationDescription(pointDestination.description)}

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${showDestinationPhotos(pointDestination.pictures)}
        </div>
      </div>
    </section>
  `;
}

function createOffers (point, pointOffers) {
  if (pointOffers.length !== null) {
    return pointOffers.find((off) => off.type === point.type).offers.map((offer, index) =>
    /* html */
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" id="event-offer-${point.type}-${index}" data-offer-id="${offer.id}" type="checkbox" name="event-offer-${point.type}" ${(point.offers.includes(offer.id) ? 'checked' : '')}>
          <label class="event__offer-label" for="event-offer-${point.type}-${index}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
      </div>`
    ).join('');
  } else {
    return '';
  }
}

function createDestinationList (pointDestinations) {
  /* html */
  return pointDestinations.map((city) => `
    <option value="${city.name}"></option>
  `).join('');
}

function createEventType (type) {
  /* html */
  return TYPES.map((pointType) => `
    <div class="event__type-item">
      <input id="event-type-${pointType}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
      <label class="event__type-label event__type-label--${pointType}" for="event-type-${pointType}-1">${capitalizeFirstLetter(pointType)}</label>
    </div>
  `).join('');
}

function createPointEditTemplate ({state, pointDestinations, pointOffers, type}) {
  const {point, isSaving, isDeleting, isDisabled} = state;
  const pointDestination = pointDestinations.find((dest) => dest.id === point.destination);

  /*html*/
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventType(point.type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${point.id}">
              ${point.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${pointDestination ? he.encode(pointDestination.name) : ''}" list="destination-list-${point.id}" autocomplete="off" required>
            <datalist id="destination-list-1">
            ${createDestinationList(pointDestinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getScheduleDate(point.dateFrom)}" required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getScheduleDate(point.dateTo)}" required>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" max="100000" name="event-price" value="${point.basePrice}" required>
          </div>
          ${pointEditControls({type, point, isSaving, isDeleting, isDisabled})}
        </header>
        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
            ${createOffers(point, pointOffers)}
            </div>
          </section>

          ${(pointDestination) ? showDestinationDescriptionPhotos(pointDestination) : ''}
        </section>
      </form>
    </li>
  `;
}

export default class PointEditView extends AbstractStatefulView {
  #pointOffers = null;
  #handleRollUpClick = null;
  #handleResetClick = null;
  #handleDeleteClick = null;
  #handleSubmitClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #type;

  constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onRollUpClick, onResetClick, onDeleteClick, onSubmitClick, type = EditType.EDITING}) {
    super();
    this.#pointOffers = pointOffers;

    this.#handleRollUpClick = onRollUpClick;
    this.#handleResetClick = onResetClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleSubmitClick = onSubmitClick;
    this.#type = type;

    this._setState(PointEditView.parsePointToState({point, pointDestinations}));
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      state: this._state,
      pointDestinations: this._state.pointDestinations,
      pointOffers: this.#pointOffers,
      type: this.#type
    });
  }

  reset = (point) => this.updateElement({point});

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  _restoreHandlers = () => {
    if (this.#type === EditType.EDITING) {
      const rollupButton = this.element.querySelector('.event__rollup-btn');
      if (rollupButton) {
        this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
      }
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    }

    if (this.#type === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetClickHandler);
    }

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    const offerContainer = this.element.querySelector('.event__available-offers');
    if (offerContainer) {
      offerContainer.addEventListener('change', this.#offerChangeHandler);
    }
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);

    this.#setDatepickers();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUpClick();
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick(PointEditView.parseStateToPoint(this._state.point));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick(PointEditView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({point: {...this._state.point, type: evt.target.value, offers: []}});
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this._state.pointDestinations.find((pointDestination) => pointDestination.name === evt.target.value);

    if (!selectedDestination) {
      return;
    }

    const selectedDestinationId = selectedDestination.id;

    this.updateElement({point: {...this._state.point, destination: selectedDestinationId}});
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({point: {...this._state.point, offers: checkedBoxes.map((element) => element.dataset.offerId)}});
  };

  #priceChangeHandler = (evt) => {
    this._setState({point: {...this._state.point, basePrice: evt.target.valueAsNumber}});
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({point: {...this._state.point, dateFrom: userDate}});
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({point: {...this._state.point, dateTo: userDate}});
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {firstDayOfWeek: 1},
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.point.dateTo
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.point.dateFrom
      }
    );
  };

  static parsePointToState = ({point, pointDestinations}) => ({point, pointDestinations, isDisabled: false, isSaving: false, isDeleting: false});
  static parseStateToPoint = (state) => state.point;
}

