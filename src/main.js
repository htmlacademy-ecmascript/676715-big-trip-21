import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointService from './points-api-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offer-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
const tripInfoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const pointsListContainer = document.querySelector('.trip-events');

const AVTORIZATION = 'Basic 87tdf12bg57hfuyfgb';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const pointApiService = new PointService(END_POINT, AVTORIZATION);
const destinationsModel = new DestinationsModel(pointApiService);
const offersModel = new OffersModel(pointApiService);
const pointsModel = new PointsModel({service: pointApiService, destinationsModel, offersModel});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: filterContainer,
  pointsModel,
  filterModel
});

const boardPresenter = new BoardPresenter({
  tripInfoContainer,
  pointsListContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel
});

filterPresenter.init();
boardPresenter.init();
pointsModel.init();
