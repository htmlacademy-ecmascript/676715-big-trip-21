import {createElement} from '../render.js';
import {formatStringToDateTime, formatStringToShortDate, formatStringToTime} from '../utils.js';

function createScheduleTemplate({dateFrom, dateTo}) {
  /*html*/
  return `
    <div class="event__schedule">
      <p class="event__time">
        <!-- <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>-->
        <time class="event__start-time" datetime=${formatStringToDateTime(dateFrom)}>${formatStringToTime(dateFrom)}</time>
        &mdash;
        <!-- <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time> -->
        <time class="event__end-time" datetime=${formatStringToDateTime(dateTo)}>${formatStringToTime(dateTo)}</time>
      </p>
      <p class="event__duration">30M</p>
    </div>
  `;
}

function createOffersTemplate({offers}) {
// function createOffersTemplate({pointOffers, offers}) {
  /*html*/
  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      <li class="event__offer">
        <!-- <span class="event__offer-title">Order Uber</span> -->
        <span class="event__offer-title">${offers.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offers.price}</span>
      </li>
    </ul>
  `;
}

function createControlsTemplate({isFavorite}) {
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  /*html*/
  return `
    <!-- <button class="event__favorite-btn event__favorite-btn--active" type="button">-->
    <button class="event__favorite-btn ${favoriteClassName}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  `;
}

function createPointTemplate({point, pointDestination, pointOffers}) {
  const {basePrice, dateFrom, dateTo, isFavorite, offers, type} = point;
  /*html*/
  return `
    <li class="trip-events__item">
      <div class="event">
      <!-- <time class="event__date" datetime="2019-03-18">MAR 18</time> -->
        <time class="event__date" datetime=${formatStringToDateTime(dateFrom)}>${formatStringToShortDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${pointDestination.name}</h3>
        ${createScheduleTemplate({dateFrom, dateTo})}
        <!-- <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
          </p>
          <p class="event__duration">30M</p>
        </div> -->
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${createOffersTemplate({pointOffers, offers})}
        <!-- <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">20</span>
          </li>
        </ul> -->
        ${createControlsTemplate({isFavorite})}
        <!-- <button class="event__favorite-btn event__favorite-btn--active" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button> -->
      </div>
    </li>
  `;
}

export default class PointCreateView {
  constructor({point, pointDestination, pointOffers}) {
    this.point = point;
    this.pointDestination = pointDestination;
    this.pointOffers = pointOffers;
  }

  getTemplate() {
    return createPointTemplate({
      point: this.point,
      pointDestination: this.pointDestination,
      pointOffers: this.pointOffers
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
