import {city} from '../mock/destination.js';

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const createArray = (dates) => Array.from({length: getRandomInteger(1, dates.length)}, () => getRandomArrayElement(dates));

const leaveUniqueElements = (array) => array.filter((item, i) => i === array.indexOf(item));

function getRandomPhoto() {
  const x = getRandomInteger(1, 20);
  const photo = {
    'src': `https://loremflickr.com/248/152?random=${x}`,
    'description': `${city} description`
  };
  return photo;
}

function updateItem (items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {getRandomInteger, getRandomArrayElement, createArray, leaveUniqueElements, getRandomPhoto, updateItem};
// export {getRandomInteger, getRandomArrayElement, createArray, leaveUniqueElements, getRandomPhoto};
