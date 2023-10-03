import {getRandomArrayElement, getRandomInteger, createArray, leaveUniqueElements, getRandomPhoto} from '../utils/common.js';
import {CITIES, CITIES_DESCRIPTION} from './const';

let city;

const getArrayPhotos = () => {
  const array = [];
  const PHOTO_COUNT = getRandomInteger(0, 4);
  for (let i = 0; i <= PHOTO_COUNT; i++) {
    array[i] = getRandomPhoto();
  }
  return array;
};

function generateDestination() {
  city = getRandomArrayElement(CITIES);

  function getDescription() {
    const array = leaveUniqueElements(createArray(CITIES_DESCRIPTION));
    const fullDescription = array.join(' ');
    return fullDescription;
  }
  const destination = {
    id: crypto.randomUUID(),
    name: city,
    description: getDescription(),
    pictures: leaveUniqueElements(getArrayPhotos()),
  };
  return destination;
}

export {generateDestination, city};
