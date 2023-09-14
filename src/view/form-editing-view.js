import flatpickr from 'flatpickr';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
// import {POINT_EMPTY, TYPES} from '../const.js';
import {TYPES} from '../const.js';
import {formatStringToDateTime2} from '../utils/point.js';
import {CITIES} from '../mock/const.js';

import 'flatpickr/dist/flatpickr.min.css';

function showDestinationPhotos (photos) {
  /*html*/
  return photos.map(({description, src}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('');
}

// function createOffers (point, pointOffers) {
//   return pointOffers.find((off) => off.type === point.type).offers.map((offer) =>
//   /*html*/
//     `<div class="event__offer-selector">
//         <input class="event__offer-checkbox  visually-hidden" id="event-offer-${point.type}-1" type="checkbox" name="event-offer-${point.type}" checked>
//         <label class="event__offer-label" for="event-offer-${point.type}-1">
//           <span class="event__offer-title">${offer.title}</span>
//           &plus;&euro;&nbsp;
//           <span class="event__offer-price">${offer.price}</span>
//         </label>
//     </div>`
//   ).join('');
// }

function createOffers (point, pointOffers) {
  return pointOffers.find((off) => off.type === point.type).offers.map((offer, index) =>
  /*html*/
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${point.type}-${index}" data-offer-id="${offer.id}" type="checkbox" name="event-offer-${point.type}" ${(point.offers.includes(offer.id) ? 'checked' : '')} >
        <label class="event__offer-label" for="event-offer-${point.type}-${index}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
    </div>`
  ).join('');
}

function createDestinationList () {
  /*html*/
  return CITIES.map((city) => `
    <option value="${city}"></option>
  `).join('');
}

function showDestination (destination, pointDestinations) {
  return pointDestinations.find((dest) => dest.id === destination).name;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createEventType (type) {
  /*html*/
  return TYPES.map((pointType) => `
    <div class="event__type-item">
      <input id="event-type-${pointType}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${capitalizeFirstLetter(pointType)}</label>
    </div>
  `).join('');
}

function createPointEditTemplate ({state, pointDestinations, pointOffers}) {
  // const {basePrice, dateFrom, dateTo, destination, type} = point;
  const {point} = state;
  const pointDestination = pointDestinations.find((dest) => dest.id === point.destination);
  const {description, photos} = pointDestination;


  // return `
  //   <li class="trip-events__item">
  //     <form class="event event--edit" action="#" method="post">
  //       <header class="event__header">
  //         <div class="event__type-wrapper">
  //           <label class="event__type  event__type-btn" for="event-type-toggle-1">
  //             <span class="visually-hidden">Choose event type</span>
  //             <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
  //           </label>
  //           <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

  //           <div class="event__type-list">
  //             <fieldset class="event__type-group">
  //               <legend class="visually-hidden">Event type</legend>
  //               ${createEventType()}
  //             </fieldset>
  //           </div>
  //         </div>

  //         <div class="event__field-group  event__field-group--destination">
  //           <label class="event__label  event__type-output" for="event-destination-1">
  //             ${type}
  //           </label>
  //           <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${showDestination(destination, pointDestinations)}" list="destination-list-1">
  //           <datalist id="destination-list-1">
  //           ${createDestinationList()}
  //           </datalist>
  //         </div>

  //         <div class="event__field-group  event__field-group--time">
  //           <label class="visually-hidden" for="event-start-time-1">From</label>
  //           <!-- <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">-->
  //           <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatStringToDateTime2(dateFrom)}">
  //           &mdash;
  //           <label class="visually-hidden" for="event-end-time-1">To</label>
  //           <!--<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">-->
  //           <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatStringToDateTime2(dateTo)}">
  //         </div>

  //         <div class="event__field-group  event__field-group--price">
  //           <label class="event__label" for="event-price-1">
  //             <span class="visually-hidden">Price</span>
  //             &euro;
  //           </label>
  //           <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
  //         </div>

  //         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  //         <button class="event__reset-btn" type="reset">Cancel</button>
  //       </header>
  //       <section class="event__details">
  //         <section class="event__section  event__section--offers">
  //           <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  //           <div class="event__available-offers">
  //           ${createOffers(point, pointOffers)}
  //           </div>
  //         </section>

  //         <section class="event__section  event__section--destination">
  //           <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  //           <p class="event__destination-description">${description}</p>

  //           <div class="event__photos-container">
  //             <div class="event__photos-tape">
  //             ${showDestinationPhotos(photos)}
  //             </div>
  //           </div>
  //         </section>
  //       </section>
  //     </form>
  //   </li>
  // `;

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
            <label class="event__label  event__type-output" for="event-destination-1">
              ${point.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${showDestination(point.destination, pointDestinations)}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${createDestinationList()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <!-- <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">-->
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatStringToDateTime2(point.dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <!--<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">-->
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatStringToDateTime2(point.dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            // <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" max="1000" name="event-price" value="${point.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
            ${createOffers(point, pointOffers)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${showDestinationPhotos(photos)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>
  `;
}

export default class PointEditView extends AbstractStatefulView {
  // #point = null;
  #pointDestinations = null;
  #pointOffers = null;
  #onResetClick = null;
  #onSubmitClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  // constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onResetClick, onSubmitClick}) {
  constructor({point, pointDestinations, pointOffers, onResetClick, onSubmitClick}) {
    super();
    // this.#point = point;
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;

    this._setState(PointEditView.parsePointToState({point}));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      // point: this.#point,
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers
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
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    // this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);

    this.#setDatepickers();
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    // this.#onSubmitClick();
    // this.#onSubmitClick(this.#point);
    this.#onSubmitClick(PointEditView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({point: {...this._state.point, type: evt.target.value, offers: []}});
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#pointDestinations.find((pointDestination) => pointDestination.name === evt.target.value);
    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : null;

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

  static parsePointToState = ({point}) => ({point});

  static parseStateToPoint = (state) => state.point;
}
