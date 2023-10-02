import FilterView from '../view/filter-view.js';
// import {generateFilters} from '../mock/filter.js';
// import {FilterType, UpdateType} from '../const.js';
// import {UpdateType} from '../const.js';
import {render, replace} from '../framework/render.js';
import {filter} from '../utils/filter.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  #filterComponent = null;
  #currentFilter = null;
  // #filters = [];

  constructor({container, filterModel, pointsModel}){
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelPointHandler);
    this.#filterModel.addObserver(this.#modelPointHandler);

    // this.#filters = generateFilters(this.#pointsModel.get());
  }

  get filters() {
    const points = this.#pointsModel.get();

    return Object.entries(filter).map(([filterType, filterPoints]) => ({type: filterType, hasPoints: filterPoints(points).length > 0}));
    // return Object.values(FilterType).map((type) => ({
    //   type,
    //   count: filter[type](points).length
    // }));
  }

  init() {
    // render(new FilterView(this.#filters), this.#container);
    this.#currentFilter = this.#filterModel.get();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      // filters
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
    this.#filterModel.set(filterType);
    // this.#filterModel.set(UpdateType.MAJOR, filterType);
  };
}


// import FilterView from '../view/filter-view.js';
// import {generateFilters} from '../mock/filter.js';
// import {render} from '../framework/render.js';

// export default class FilterPresenter {
//   #container = null;
//   #pointsModel = null;
//   #filters = [];

//   constructor({container, pointsModel}){
//     this.#container = container;
//     this.#pointsModel = pointsModel;

//     this.#filters = generateFilters(this.#pointsModel.get());
//   }

//   init() {
//     render(new FilterView(this.#filters), this.#container);
//   }
// }
