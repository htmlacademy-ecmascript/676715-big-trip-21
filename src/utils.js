import dayjs from 'dayjs';
import {city} from './mock/destination.js';

// временно закомментировано
// const MSEC_IN_SEC = 1000;
// const SEC_IN_MIN = 60;
// const MIN_IN_HOUR = 60;
// const HOUR_IN_DAY = 24;
// const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
// const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

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

function getRandomPhoto () {
  const x = getRandomInteger(1, 20);
  const photo = {
    'src': `https://loremflickr.com/248/152?random=${x}`,
    'description': `${city} description`
  };
  return photo;
}

function formatStringToDateTime(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

function formatStringToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToTime(date) {
  return dayjs(date).format('HH:mm');
}

export {getRandomInteger, getRandomArrayElement, createArray, leaveUniqueElements, getRandomPhoto, formatStringToDateTime, formatStringToShortDate, formatStringToTime};
