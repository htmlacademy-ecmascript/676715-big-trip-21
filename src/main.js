import FilterView from './view/filter-view.js';
import PointInfoView from './view/point-info.js';
import BoardPresenter from './presenter/board-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offer-model.js';
import PointsModel from './model/points-model.js';
import {render, RenderPosition} from './framework/render.js';

// const bodyElement = document.querySelector('body');
// const headerElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');
// const mainElement = document.querySelector('.page-main');
const pointsListElement = document.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const boardPresenter = new BoardPresenter({
  container: pointsListElement,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new PointInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement);

boardPresenter.init();
