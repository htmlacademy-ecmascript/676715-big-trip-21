import EventListEmptyView from '../view/event-list-empty-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointCreateView from '../view/form-creation-view.js';
import PointEditView from '../view/form-editing-view.js';
import {render, replace} from '../framework/render.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #sortComponent = new SortView();
  #eventListComponent = null;

  #points = [];

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = [...this.#pointsModel.get()];
  }

  init() {
    if (this.#points.length === 0) {
      render(new EventListEmptyView(), this.#container);
      return;
    }

    this.#eventListComponent = new EventListView();

    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint = (point) => {
    const pointCreateComponent = new PointCreateView({
      point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: pointEditClickHandler
    });

    const pointEditComponent = new PointEditView({
      point,
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onResetClick: resetButtonClickHandler,
      onSubmitClick: pointSubmitHandler
    });

    const replacePointToForm = () => {
      replace(pointEditComponent, pointCreateComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointCreateComponent, pointEditComponent);
    };

    const escKeyHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyHandler);
      }
    };

    function pointEditClickHandler() {
      replacePointToForm();
      document.addEventListener('keydown', escKeyHandler);
    }

    function resetButtonClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyHandler);
    }

    function pointSubmitHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyHandler);
    }

    render (pointCreateComponent, this.#eventListComponent.element);
  };
}
