import FilterView from '../view/filter-view.js';
import {render, replace} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import {UpdateType} from '../const';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  #filterComponent = null;
  #currentFilter = null;

  constructor({container, pointsModel, filterModel}){
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelPointHandler);
    this.#filterModel.addObserver(this.#modelPointHandler);
  }

  get filters() {
    const points = this.#pointsModel.get();

    return Object.entries(filter).map(([filterType, filterPoints]) => ({type: filterType, hasPoints: filterPoints(points).length > 0}));
  }

  init() {
    this.#currentFilter = this.#filterModel.get();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilter: this.#currentFilter,
      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
    }
  }

  #modelPointHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.get() === filterType) {
      return;
    }
    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };
}

