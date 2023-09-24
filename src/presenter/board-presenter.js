import PointsListEmptyView from '../view/points-list-empty-view.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
// import {updateItem} from '../utils/common.js';
// import {render, replace} from '../framework/render.js';
import {remove, render, replace} from '../framework/render.js';
import {sort} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import {UserAction, UpdateType, FilterType, SortType, enabledSortType} from '../const.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  // #sortComponent = new SortView();
  // #pointsListComponent = null;
  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #messageComponent = null;

  // #points = [];
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #newPointButtonPresenter = null;

  #currrentSortType = SortType.DAY;
  #isCreating = false;

  constructor({container, destinationsModel, offersModel, pointsModel, filterModel, newPointButtonPresenter}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointButtonPresenter = newPointButtonPresenter;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#pointChangeHandler,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#modelPointHandler);
    this.#filterModel.addObserver(this.#modelPointHandler);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.get());

    return sort[this.#currrentSortType](filteredPoints);
  }

  init() {
    this.#renderBoard();
  }

  newButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currrentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonPresenter.disableButon();
    this.#newPointPresenter.init();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#pointChangeHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => this.points.forEach((point) => this.#renderPoint(point));

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    const sortTypes = Object.values(SortType).map((type) => ({type, isChecked: (type === this.#currrentSortType), isDisabled: !enabledSortType[type]}));

    this.#sortComponent = new SortView({items: sortTypes, onItemChange: this.#sortTypeChangeHandler});

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#container);
    }
  };

  #renderMessage = () => {
    this.#messageComponent = new PointsListEmptyView ({filterType: this.#filterModel.get()});
    render(this.#messageComponent, this.#container);
  };

  #renderPointContainer = () => {
    // this.#pointsListComponent = new PointsListView();
    render(this.#pointsListComponent, this.#container);
  };

  #renderBoard = () => {
    if (this.points.length === 0 && !this.#isCreating) {
      // render(new PointsListEmptyView(), this.#container);
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    // render(this.#sortComponent, this.#container);
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#clearPoints();
    remove(this.#messageComponent);
    remove(this.#sortComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currrentSortType = SortType.DAY;
    }
  };

  // #pointChangeHandler = (updatedPoint) => {
  //   this.#points = updateItem(this.#points, updatedPoint);
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  // };

  #pointChangeHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
      case UserAction.CREATE_POINT:
        this.#pointsModel.add(updateType, update);
        break;
    }
  };

  #modelPointHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters?.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#currrentSortType = sortType;

    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #newPointDestroyHandler = ({isCanceled}) => {
    this.#isCreating = false;
    this.#newPointButtonPresenter.enableButton();
    if (this.points.length === 0 && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };
}
