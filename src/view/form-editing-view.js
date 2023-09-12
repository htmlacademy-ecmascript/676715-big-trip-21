import AbstractView from '../framework/view/abstract-view.js';
// import {POINT_EMPTY, TYPES} from '../const.js';
import {TYPES} from '../const.js';
import {formatStringToDateTime2} from '../utils/point.js';
import {CITIES} from '../mock/const.js';

function showDestinationPhotos (photos) {
  /*html*/
  return photos.map(({description, src}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('');
}

function createOffers (point, pointOffers) {
  return pointOffers.find((off) => off.type === point.type).offers.map((offer) =>
  /*html*/
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${point.type}-1" type="checkbox" name="event-offer-${point.type}" checked>
        <label class="event__offer-label" for="event-offer-${point.type}-1">
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

function createEventType () {
  /*html*/
  return TYPES.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
    </div>
  `).join('');
}

function createPointEditTemplate ({point, pointDestinations, pointOffers}) {
  const {basePrice, dateFrom, dateTo, destination, type} = point;
  const pointDestination = pointDestinations.find((dest) => dest.id === destination);
  const {description, photos} = pointDestination;

  /*html*/
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventType()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${showDestination(destination, pointDestinations)}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${createDestinationList()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <!-- <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">-->
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatStringToDateTime2(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <!--<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">-->
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatStringToDateTime2(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
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

export default class PointEditView extends AbstractView {
  #point = null;
  #pointDestinations = null;
  #pointOffers = null;
  #onResetClick = null;
  #onSubmitClick = null;

  // constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onResetClick, onSubmitClick}) {
  constructor({point, pointDestinations, pointOffers, onResetClick, onSubmitClick}) {
    super();
    this.#point = point;
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetButtonClickHandler);
    // this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetButtonClickHandler);
    // this.element.querySelector('form').addEventListener('submit', this.#pointSubmitHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#pointSubmitHandler);
  }

  get template() {
    return createPointEditTemplate({
      point: this.#point,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers
    });
  }

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #pointSubmitHandler = (evt) => {
    evt.preventDefault();
    // this.#onSubmitClick();
    this.#onSubmitClick(this.#point);
  };
}
