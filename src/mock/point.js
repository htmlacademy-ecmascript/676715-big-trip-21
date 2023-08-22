import {getRandomInteger} from '../utils.js';
import {getDate} from '../mock/utils.js';
import {Price} from '../mock/const.js';

function generatePoint(type, idDestination, idOffer) {
  const point = {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({next: false}),
    dateTo: getDate({next: true}),
    destination: idDestination,
    isFavorite: !!getRandomInteger(0, 1),
    offers: idOffer,
    type
  };
  return point;
}

export {generatePoint};
