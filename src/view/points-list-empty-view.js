import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

function createPointListEmptyMessage(filterType) {
  const message = FilterMessage[filterType];
  /* html */
  return `
    <p class="trip-events__msg">${message}</p>
  `;
}

export default class PointsListEmptyView extends AbstractView {
  #filterType = null;

  constructor({filterType, isEmpty}) {
    super();

    this.#filterType = isEmpty ? FilterType.EVERYTHING : filterType;
  }

  get template() {
    return createPointListEmptyMessage(this.#filterType);
  }
}
