import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointCreateView from '../view/form-creation-view.js';
import PointEditView from '../view/form-editing-view.js';
import {render} from '../framework/render.js';

// import {POINT_COUNT} from '../const.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #sortComponent = new SortView();
  #eventListComponent = new EventListView();

  #points = [];

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = [...this.#pointsModel.get()];
  }

  init() {
    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);

    render(
      new PointEditView({
        point: this.#points[0],
        pointDestinations: this.#destinationsModel.get(),
        pointOffers: this.#offersModel.get()
      }),
      this.#eventListComponent.element
    );

    this.#points.forEach((point) => {
      render(
        new PointCreateView({
          point,
          // дописать pointDestination ?
          pointDestination: this.#destinationsModel.getById(point.destination),
          pointOffers: this.#offersModel.getByType(point.type)
        }),
        this.#eventListComponent.element
      );
    });

    // for (let i = 0; i < POINT_COUNT; i++) {
    //   render(new PointCreateView(), this.eventListComponent.getElement());
    // }
  }
}
