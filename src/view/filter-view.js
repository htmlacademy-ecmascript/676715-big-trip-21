import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/point.js';

function createFilterElement (filtertElement, currentFilter) {
  const {type, hasPoints} = filtertElement;
  /* html */
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilter ? 'checked' : ''} ${hasPoints === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizeFirstLetter(type)}</label>
    </div>
  `;
}

function createFilter ({filters, currentFilter}) {
  /* html */
  return `
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filtertElement) => createFilterElement(filtertElement, currentFilter)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilter, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilter({filters: this.#filters, currentFilter: this.#currentFilter});
  }

  #filterTypeChangeHandler = (evt) => {
    this.#handleFilterTypeChange(evt.target.value);
  };
}
