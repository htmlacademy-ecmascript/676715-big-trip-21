import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createNewPointButton({disabled}) {
  /*html*/
  return `
    <button class="trip-main__event-add-btn btn btn--big btn--yellow" ${disabled ? 'disabled' : ''} type="button">New event</button>
  `;
}

export default class NewPointButtonView extends AbstractStatefulView {
  #handleClick = null;

  constructor({onClick, disabled = false}) {
    super();

    this.#handleClick = onClick;

    this._setState(NewPointButtonView.parseButtonToState({disabled}));
    this._restoreHandlers();
  }

  get template() {
    return createNewPointButton({disabled: this._state.disabled});
  }

  setDisabled(disabled) {
    this.updateElement(NewPointButtonView.parseButtonToState({disabled}));
  }

  _restoreHandlers() {
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  static parseButtonToState = ({disabled}) => ({disabled});
  static parseStateToButton = (state) => (state.disabled);
}
