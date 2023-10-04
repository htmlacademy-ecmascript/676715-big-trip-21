import TripInfoView from '../view/trip-info.js';
import NewPointButtonView from '../view/points-list-new-point-view.js';
import SortView from '../view/sort-view.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import PointsListView from '../view/points-list-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {sort} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import {UserAction, UpdateType, FilterType, SortType} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class BoardPresenter {
  #tripInfoContainer = null;
  #pointsListContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  #loadingComponent = new LoadingView();
  #pointsListComponent = new PointsListView();
  #pointsListEmptyComponent = new PointsListEmptyView();
  #sortComponent = null;
  #points = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #newPointButton = null;

  #currentSortType = SortType.DAY;
  #isCreating = false;
  #isLoading = true;
  #isLoadingError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({tripInfoContainer, pointsListContainer, destinationsModel, offersModel, pointsModel, filterModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsListContainer = pointsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelPointHandler);
    this.#filterModel.addObserver(this.#modelPointHandler);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.get());

    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#newPointButton = new NewPointButtonView({onClick: this.#newPointButtonClickHandler});
    render(this.#newPointButton, this.#tripInfoContainer);
    render(new TripInfoView(), this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    this.#renderBoard();
    this.#renderNewPoint();
  }

  #renderNewPoint = () => {
    this.#newPointPresenter = new NewPointPresenter({
      headerContainer: this.#tripInfoContainer,
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler
    });
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => this.points.forEach((point) => this.#renderPoint(point));

  #renderEmptyPointsList = () => {
    this.#pointsListEmptyComponent = new PointsListEmptyView ({filterType: this.#filterModel.get()});

    render(this.#pointsListEmptyComponent, this.#pointsListContainer);
  };

  #renderPointContainer = () => {
    render(this.#pointsListComponent, this.#pointsListContainer);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    render(this.#sortComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
    } else {
      if (this.points.length === 0 && !this.#isCreating) {
        this.#renderEmptyPointsList();
      } else {
        this.#renderSort();
        this.#renderPointContainer();
        this.#renderPoints();
      }
    }
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#clearPoints();
    remove(this.#sortComponent);
    this.#sortComponent = null;
    remove(this.#pointsListEmptyComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
      this.#renderSort();
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.delete(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
          this.#uiBlocker.unblock();
          return Promise.reject();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelPointHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isLoadingError = data.isError;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#pointsModel.get());
    this.#clearBoard();
    this.#renderBoard();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(FilterType.EVERYTHING);
    this.#newPointButton.setDisabled(true);
    this.#newPointPresenter.init();
    remove(this.#pointsListEmptyComponent);
  };

  #newPointDestroyHandler = (isCanceled) => {
    this.#isCreating = false;
    this.#newPointButton.setDisabled(false);
    if (this.points.length === 0 && isCanceled) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#renderEmptyPointsList();
    }
  };
}
