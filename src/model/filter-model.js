import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get() {
    return this.#filter;
  }

  set(updateType, update) {
    this.#filter = updateType;
    this._notify = updateType;
    // this._notify(updateType);
    // this._notify(updateType, update);
  }
}
