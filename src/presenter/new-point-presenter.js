import PointEditView from '../view/points-list-point-edit-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType, EditType} from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #pointNewComponent = null;

  constructor({container, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }

    this.#pointNewComponent = new PointEditView({
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      // onRollUpClick: this.#rollUpClickHandler,
      onResetClick: this.#resetClickHandler,
      // onDeleteClick: this.#deleteClickHandler,
      onSubmitClick: this.#formSubmitHandler,
      type: EditType.CREATING
    });

    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyHandler);
  }

  destroy = ({isCanceled = true} = {}) => {
    if (this.#pointNewComponent === null) {
      return;
    }

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keydown', this.#escKeyHandler);
    this.#handleDestroy({isCanceled});
  };

  #escKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #resetClickHandler = () => {
    this.destroy();
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.CREATE_POINT, UpdateType.MINOR, point);
    this.destroy({isCanceled: false});
  };
}
