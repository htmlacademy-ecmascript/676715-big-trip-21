import PointEditView from '../view/points-list-point-edit-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType, Mode, EditType} from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #newPointComponent = null;
  #mode = null;

  constructor({container, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#newPointComponent !== null) {
      return;
    }

    this.#newPointComponent = new PointEditView({
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onResetClick: this.#resetClickHandler,
      onSubmitClick: this.#formSubmitHandler,
      type: EditType.CREATING
    });

    render(this.#newPointComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyHandler);
  }

  destroy = (isCanceled = true) => {
    if (this.#newPointComponent === null) {
      return;
    }
    this.#handleDestroy(isCanceled);
    remove(this.#newPointComponent);
    this.#newPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#newPointComponent.updateElement({isDisabled: true, isSaving: true});
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#newPointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#newPointComponent.shake(resetFormState);
  }

  #escKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  };

  #resetClickHandler = () => {
    this.destroy();
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, point).then(() => this.destroy(false)).catch();
  };
}
