// import FilterView from './view/filter-view.js';
// import PointInfoView from './view/point-info.js';
// import NewPointPresenter from './presenter/new-point-presenter.js';
// import NewPointButtonView from './view/points-list-new-point-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offer-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
// import {render, RenderPosition} from './framework/render.js';

// const bodyElement = document.querySelector('body');
// const headerElement = document.querySelector('.page-header');
// const mainElement = document.querySelector('.page-main');
const tripInfoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const pointsListContainer = document.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filterModel = new FilterModel();

// const newPointPresenter = new NewPointPresenter({
//   container: pointInfoElement
// });

const filterPresenter = new FilterPresenter({
  container: filterContainer,
  filterModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  tripInfoContainer,
  pointsListContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  // newPointPresenter: newPointPresenter
});

// render(new PointInfoView(), pointInfoElement, RenderPosition.AFTERBEGIN);

// newPointPresenter.init({onButtonClick: boardPresenter.newPointButtonClickHandler});
filterPresenter.init();
boardPresenter.init();
// pointsModel.init();

// вариант из ретро
// import FilterView from './view/filter-view.js';
// import PointInfoView from './view/point-info.js';
// import NewPointPresenter from './presenter/new-point-presenter.js';
// import NewPointView from './view/points-list-new-point-view.js';
// import FilterPresenter from './presenter/filter-presenter.js';
// import BoardPresenter from './presenter/board-presenter.js';
// import MockService from './service/mock-service.js';
// import DestinationsModel from './model/destinations-model.js';
// import OffersModel from './model/offer-model.js';
// import PointsModel from './model/points-model.js';
// import FilterModel from './model/filter-model.js';
// import {render, RenderPosition} from './framework/render.js';

// // const bodyElement = document.querySelector('body');
// // const headerElement = document.querySelector('.page-header');
// const pointInfoElement = document.querySelector('.trip-main');
// const filterContainer = document.querySelector('.trip-controls__filters');
// // const mainElement = document.querySelector('.page-main');
// const pointsListContainer = document.querySelector('.trip-events');

// const mockService = new MockService();
// const destinationsModel = new DestinationsModel(mockService);
// const offersModel = new OffersModel(mockService);
// const pointsModel = new PointsModel(mockService);
// const filterModel = new FilterModel();

// const newPointPresenter = new NewPointPresenter({
//   container: pointInfoElement
// });

// const filterPresenter = new FilterPresenter({
//   container: filterContainer,
//   filterModel,
//   pointsModel
// });

// const boardPresenter = new BoardPresenter({
//   container: pointsListContainer,
//   destinationsModel,
//   offersModel,
//   pointsModel,
//   filterModel,
//   newPointPresenter: newPointPresenter
// });

// render(new PointInfoView(), pointInfoElement, RenderPosition.AFTERBEGIN);

// newPointPresenter.init({onButtonClick: boardPresenter.newPointButtonClickHandler});
// filterPresenter.init();
// boardPresenter.init();
