import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';
// import {capitalizeFirstLetter} from '../utils/point.js';

function createSort (currentSortType) {
  /* html */
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SortType.DAY}" ${currentSortType === SortType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SortType.TIME}" ${currentSortType === SortType.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE}" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>
      <div class="trip-sort__item  trip-sort__item--oer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>
  `;
}

// вариант, когда создается каждый элемент сортировки
// function createSortElement ({type, isChecked, isDisabled}) {
//   /* html */
//   return
// `
//   <div class="trip-sort__item  trip-sort__item--${type}">
//       <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" data-item="${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
//       <label class="trip-sort__btn" for="sort-${type}">${capitalizeFirstLetter(type)}</label>
//     </div>
//   `;
// }

// function createSort (sorts) {
//   /* html */
//   return `
//     <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
//       ${sorts.map((sortElement) => createSortElement(sortElement)).join('')}
//     </form>
//   `;
// }

export default class SortView extends AbstractView {
  // #sorts = [];
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor(currentSortType, onSortTypeChange) {
    super();

    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSort(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}


// export default class SortView extends AbstractView {
//   // #sorts = [];

//   constructor(sorts) {
//     super();

//     this.#sorts = sorts;
//   }

//   get template() {
//     return createSort({sorts: this.#sorts});
//   }
// }

// export default class SortView extends AbstractView {
//   get template() {
//     return createSortElement();
//   }
// }
