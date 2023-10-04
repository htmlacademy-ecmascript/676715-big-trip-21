import Observable from '../framework/observable.js';
import {updateItem} from '../utils/common.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = [];
  #destinationsModel = null;
  #offersModel = null;

  constructor({service, destinationsModel, offersModel}) {
    super();

    this.#service = service;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  async init() {
    try{
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#service.points;
      this.#points = points.map(this.#adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});
    } catch(err) {
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  get() {
    return this.#points;
  }

  getById(id) {
    return this.#points.find((point) => point.id === id);
  }

  async update(updateType, point) {
    try {
      const updatedPoint = await this.#service.updatePoint(point);
      const adaptedPoint = this.#adaptToClient(updatedPoint);
      this.#points = updateItem(this.#points, adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async add(updateType, point) {
    try {
      const addedPoint = await this.#service.addPoint(point);
      const adaptedPoint = this.#adaptToClient(addedPoint);
      this.#points.push(adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async delete(updateType, point) {
    try {
      await this.#service.deletePoint(point);
      this.#points = this.#points.filter((pointItem) => pointItem.id !== point.id);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
      basePrice: point['base_price'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  }
}
