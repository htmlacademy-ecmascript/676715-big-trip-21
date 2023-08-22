import {getRandomInteger} from '../utils.js';
import {Price} from '../mock/const.js';

function generateOffer(type) {
  const offer = {
    id: crypto.randomUUID(),
    title: `Offer ${type}`,
    price: getRandomInteger(Price.MIN, Price.MAX / 10)
  };
  return offer;
}

export {generateOffer};
