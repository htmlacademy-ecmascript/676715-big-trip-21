import {SortType} from '../const.js';
import {getPointsDateDifference, getPointsDurationDifference, getPointsPriceDifference} from './point.js';

const sort = {
  [SortType.DAY]: (points) => points.toSorted(getPointsDateDifference),
  [SortType.PRICE]: (points) => points.toSorted(getPointsPriceDifference),
  [SortType.TIME]: (points) => points.toSorted(getPointsDurationDifference),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Sort by ${SortType.OFFER} is not implemented`);
  }
};

export {sort};
