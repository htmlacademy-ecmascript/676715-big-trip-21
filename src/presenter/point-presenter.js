import PointCreateView from '../view/form-creation-view.js';
import PointEditView from '../view/form-editing-view.js';
import {render, replace, remove} from '../framework/render.js';
import {Mode} from '../const.js';

export default class PointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #pointCreateComponent = null;
  #pointEditComponent = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor({container, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointCreateComponent = this.#pointCreateComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointCreateComponent = new PointCreateView({
      point: this.#point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: this.#editClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onResetClick: this.#resetButtonClickHandler,
      onSubmitClick: this.#formSubmitHandler
    });

    if (prevPointCreateComponent === null || prevPointEditComponent === null) {
      render(this.#pointCreateComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointCreateComponent, prevPointCreateComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointCreateComponent);
    remove(prevPointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointCreateComponent);
    remove(this.#pointEditComponent);
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointCreateComponent);
    document.addEventListener('keydown', this.#escKeyHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointCreateComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  // #editClickHandler = () => this.#replacePointToForm();
  #editClickHandler = () => {
    this.#replacePointToForm();
  };

  // #favoriteClickHandler = () => this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  #favoriteClickHandler = () => {
    this.#handleDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  // #resetButtonClickHandler = () => this.#replaceFormToPoint();
  #resetButtonClickHandler = () => {
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
  };
}
