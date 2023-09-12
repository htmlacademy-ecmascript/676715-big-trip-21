import EventListEmptyView from '../view/event-list-empty-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
// import PointCreateView from '../view/form-creation-view.js';
// import PointEditView from '../view/form-editing-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
// import {render, replace} from '../framework/render.js';
import {render} from '../framework/render.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #sortComponent = new SortView();
  #eventListComponent = null;

  #points = [];
  #pointPresenters = new Map();

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = [...this.#pointsModel.get()];
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#pointChangeHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => this.#points.forEach((point) => this.#renderPoint(point));

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderPointContainer = () => {
    this.#eventListComponent = new EventListView();
    render(this.#eventListComponent, this.#container);
  };

  #renderBoard = () => {
    if (this.#points.length === 0) {
      render(new EventListEmptyView(), this.#container);
      return;
    }

    render(this.#sortComponent, this.#container);
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
