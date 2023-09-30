import TripInfoView from '../view/trip-info.js';
// import NewPointButtonView from './view/points-list-new-point-view.js';
import NewPointButtonView from '../view/points-list-new-point-view.js';
import SortView from '../view/sort-view.js';
// import BoardView from '../view/board-view.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import PointsListView from '../view/points-list-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
// import {updateItem} from '../utils/common.js';
// import {render, replace} from '../framework/render.js';
import {remove, render, RenderPosition, replace} from '../framework/render.js';
import {sort} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import {UserAction, UpdateType, FilterType, SortType, enabledSortType} from '../const.js';

export default class BoardPresenter {
  #tripInfoContainer = null;
  #pointsListContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  // #boardComponent = new BoardView();
  #pointsListComponent = new PointsListView();
  #pointsListEmptyComponent = new PointsListEmptyView();
  #sortComponent = null;
  #points = null;
  // #pointsListEmptyComponent = null;
  // #pointsListComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #newPointButton = null;

  #currentSortType = SortType.DAY;
  #isCreating = false;

  constructor({tripInfoContainer, pointsListContainer, destinationsModel, offersModel, pointsModel, filterModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsListContainer = pointsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelPointHandler);
    this.#filterModel.addObserver(this.#modelPointHandler);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.get());

    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    render(new TripInfoView(), this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    this.#newPointButton = new NewPointButtonView({onNewPointButton: this.#newPointButtonClickHandler});
    render(this.#newPointButton, this.#tripInfoContainer);
    this.#renderNewPoint();
    this.#renderBoard();
  }

  // createNewPoint () {
  //   this.#isCreating = true;
  //   this.#currentSortType = SortType.DAY;
  //   this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
  //   // this.#newPointButtonPresenter.disableButon();
  //   this.#newPointPresenter.init();
  //   if (this.points.length === 0) {
  //     remove(this.#pointsListEmptyComponent);
  //   }
  // }

  #renderNewPoint = () => {
    this.#newPointPresenter = new NewPointPresenter({
      headerContainer: this.#tripInfoContainer,
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler
    });
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => this.points.forEach((point) => this.#renderPoint(point));

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    const sortTypes = Object.values(SortType).map((type) => ({type, isChecked: (type === this.#currentSortType), isDisabled: !enabledSortType[type]}));

    this.#sortComponent = new SortView({items: sortTypes, onItemChange: this.#sortTypeChangeHandler});

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#pointsListContainer);
    }
  };

  #renderEmptyPointsList = () => {
    this.#pointsListEmptyComponent = new PointsListEmptyView ({filterType: this.#filterModel.get()});
    render(this.#pointsListEmptyComponent, this.#pointsListContainer);
  };

  #renderPointContainer = () => {
    // this.#pointsListComponent = new PointsListView();
    render(this.#pointsListComponent, this.#pointsListContainer);
  };

  #renderBoard = () => {
    if (this.points.length === 0 && !this.#isCreating) {
      // render(new PointsListEmptyView(), this.#container);
      this.#renderEmptyPointsList();
      return;
    }

    // render(this.#sortComponent, this.#container);
    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    // this.#pointPresenters.forEach((presenter) => presenter.destroy());
    // this.#pointPresenters.clear();
    this.#clearPoints();
    remove(this.#pointsListEmptyComponent);
    remove(this.#sortComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  // дописать после Server
  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
      case UserAction.CREATE_POINT:
        this.#pointsModel.add(updateType, update);
        break;
    }
  };

  #modelPointHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters?.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    // this.#clearPoints();
    // this.#renderSort();
    // this.#renderPoints();
    this.#clearBoard();
    this.#renderBoard();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButton.setDisabled(true);
    this.#newPointPresenter.init();
    remove(this.#pointsListEmptyComponent);
  };

  #newPointDestroyHandler = ({isCanceled}) => {
    this.#isCreating = false;
    this.#newPointButton.setDisabled(false);
    if (this.points.length === 0 && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };
}

// вариант из ретро
// import SortView from '../view/sort-view.js';
// import PointsListEmptyView from '../view/points-list-empty-view.js';
// import PointsListView from '../view/points-list-view.js';
// import PointPresenter from './point-presenter.js';
// import NewPointPresenter from './new-point-presenter.js';
// // import {updateItem} from '../utils/common.js';
// // import {render, replace} from '../framework/render.js';
// import {remove, render, replace} from '../framework/render.js';
// import {sort} from '../utils/sort.js';
// import {filter} from '../utils/filter.js';
// import {UserAction, UpdateType, FilterType, SortType, enabledSortType} from '../const.js';

// export default class BoardPresenter {
//   #container = null;
//   #destinationsModel = null;
//   #offersModel = null;
//   #pointsModel = null;
//   #filterModel = null;

//   // #sortComponent = new SortView();
//   // #pointsListComponent = null;

//   #sortComponent = null;
//   #pointsListComponent = new PointsListView();
//   // #pointsListEmptyComponent = new PointsListEmptyView();
//   #pointsListEmptyComponent = null;

//   // #points = [];
//   #pointPresenters = new Map();
//   #newPointPresenter = null;
//   #newPointButtonPresenter = null;

//   #currentSortType = SortType.DAY;
//   #isCreating = false;

//   constructor({container, destinationsModel, offersModel, pointsModel, filterModel, newPointButtonPresenter}) {
//     this.#container = container;
//     this.#destinationsModel = destinationsModel;
//     this.#offersModel = offersModel;
//     this.#pointsModel = pointsModel;
//     this.#filterModel = filterModel;
//     this.#newPointButtonPresenter = newPointButtonPresenter;

//     // this.#newPointPresenter = new NewPointPresenter({
//     //   container: this.#pointsListComponent.element,
//     //   destinationsModel: this.#destinationsModel,
//     //   offersModel: this.#offersModel,
//     //   onDataChange: this.#handleViewAction,
//     //   onDestroy: this.#newPointDestroyHandler
//     // });

//     this.#newPointPresenter = new NewPointPresenter({
//       container: this.#pointsListComponent.element,
//       destinationsModel: this.#destinationsModel,
//       offersModel: this.#offersModel,
//       onDataChange: this.#handleViewAction,
//       onDestroy: this.#newPointDestroyHandler
//     });

//     this.#pointsModel.addObserver(this.#modelPointHandler);
//     this.#filterModel.addObserver(this.#modelPointHandler);
//   }

//   get points() {
//     const filterType = this.#filterModel.get();
//     const filteredPoints = filter[filterType](this.#pointsModel.get());

//     return sort[this.#currentSortType](filteredPoints);
//   }

//   init() {
//     this.#renderBoard();
//   }

//   newPointButtonClickHandler = () => {
//     this.#isCreating = true;
//     this.#currentSortType = SortType.DAY;
//     this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
//     this.#newPointButtonPresenter.disableButon();
//     this.#newPointPresenter.init();
//   };

//   #renderNewPoint = () => {};

//   #renderPoint = (point) => {
//     const pointPresenter = new PointPresenter({
//       container: this.#pointsListComponent.element,
//       destinationsModel: this.#destinationsModel,
//       offersModel: this.#offersModel,
//       onDataChange: this.#handleViewAction,
//       onModeChange: this.#modeChangeHandler
//     });

//     pointPresenter.init(point);
//     this.#pointPresenters.set(point.id, pointPresenter);
//   };

//   #renderPoints = () => this.points.forEach((point) => this.#renderPoint(point));

//   #clearPoints = () => {
//     this.#pointPresenters.forEach((presenter) => presenter.destroy());
//     this.#pointPresenters.clear();
//     this.#newPointPresenter.destroy();
//   };

//   #renderSort = () => {
//     const prevSortComponent = this.#sortComponent;
//     const sortTypes = Object.values(SortType).map((type) => ({type, isChecked: (type === this.#currentSortType), isDisabled: !enabledSortType[type]}));

//     this.#sortComponent = new SortView({items: sortTypes, onItemChange: this.#sortTypeChangeHandler});

//     if (prevSortComponent) {
//       replace(this.#sortComponent, prevSortComponent);
//       remove(prevSortComponent);
//     } else {
//       render(this.#sortComponent, this.#container);
//     }
//   };

//   #renderEmptyPointsList = () => {
//     this.#pointsListEmptyComponent = new PointsListEmptyView ({filterType: this.#filterModel.get()});
//     render(this.#pointsListEmptyComponent, this.#container);
//   };

//   #renderPointContainer = () => {
//     // this.#pointsListComponent = new PointsListView();
//     render(this.#pointsListComponent, this.#container);
//   };

//   #renderBoard = () => {
//     if (this.points.length === 0 && !this.#isCreating) {
//       // render(new PointsListEmptyView(), this.#container);
//       this.#renderEmptyPointsList();
//       return;
//     }

//     this.#renderSort();
//     // render(this.#sortComponent, this.#container);
//     this.#renderPointContainer();
//     this.#renderPoints();
//   };

//   #clearBoard = ({resetSortType = false} = {}) => {
//     // this.#pointPresenters.forEach((presenter) => presenter.destroy());
//     // this.#pointPresenters.clear();
//     this.#clearPoints();
//     remove(this.#pointsListEmptyComponent);
//     remove(this.#sortComponent);
//     this.#sortComponent = null;

//     if (resetSortType) {
//       this.#currentSortType = SortType.DAY;
//     }
//   };

//   // #handleViewAction = (updatedPoint) => {
//   //   this.#points = updateItem(this.#points, updatedPoint);
//   //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
//   // };

//   #handleViewAction = (actionType, updateType, update) => {
//     switch (actionType) {
//       case UserAction.UPDATE_POINT:
//         this.#pointsModel.update(updateType, update);
//         break;
//       case UserAction.DELETE_POINT:
//         this.#pointsModel.delete(updateType, update);
//         break;
//       case UserAction.CREATE_POINT:
//         this.#pointsModel.add(updateType, update);
//         break;
//     }
//   };

//   #modelPointHandler = (updateType, data) => {
//     switch (updateType) {
//       case UpdateType.PATCH:
//         this.#pointPresenters?.get(data.id)?.init(data);
//         break;
//       case UpdateType.MINOR:
//         this.#clearBoard();
//         this.#renderBoard();
//         break;
//       case UpdateType.MAJOR:
//         this.#clearBoard({resetSortType: true});
//         this.#renderBoard();
//         break;
//     }
//   };

//   #sortTypeChangeHandler = (sortType) => {
//     this.#currentSortType = sortType;

//     this.#clearPoints();
//     // this.#clearBoard();
//     this.#renderSort();
//     this.#renderPoints();
//   };

//   #modeChangeHandler = () => {
//     this.#pointPresenters.forEach((presenter) => presenter.resetView());
//     this.#newPointPresenter.destroy();
//   };

//   #newPointDestroyHandler = ({isCanceled}) => {
//     this.#isCreating = false;
//     this.#newPointButtonPresenter.enableButton();
//     if (this.points.length === 0 && isCanceled) {
//       this.#clearBoard();
//       this.#renderBoard();
//     }
//   };
// }
