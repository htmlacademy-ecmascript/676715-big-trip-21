// import {FilterView} from './view/filter-view.js';
// import {PointInfoView} from './view/point-info.js';
// import {BoardPresenter} from './presenter/board-presenter.js';
import FilterView from './view/filter-view.js';
import PointInfoView from './view/point-info.js';
import BoardPresenter from './presenter/board-presenter.js';

import {render, RenderPosition} from './render.js';

// const bodyElement = document.querySelector('body');
// const headerElement = document.querySelector('.page-header');
const tripInfoElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');
// const mainElement = document.querySelector('.page-main');
const eventListElement = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  container: eventListElement
});

render(new PointInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement);

boardPresenter.init();
