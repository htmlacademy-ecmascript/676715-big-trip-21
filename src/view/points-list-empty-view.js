import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

function createPointListEmptyMessage({message}) {
  /*html*/
  return `
    <p class="trip-events__msg">${message}</p>
  `;
}

export default class PointsListEmptyView extends AbstractView {
  #filterType;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    const message = FilterMessage[this.#filterType];

    return createPointListEmptyMessage({message});
  }
}
