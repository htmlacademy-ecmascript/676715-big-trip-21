import dayjs from 'dayjs';
import {getRandomInteger} from '../utils/common.js';
import {Duration} from './const.js';

let date = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

function getDate({next}) {
  const minsGap = getRandomInteger(0, Duration.MIN);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);

  if (next) {
    date = dayjs(date).add(minsGap, 'minute').add(hoursGap, 'hour').add(daysGap, 'day').toDate();
  }

  return date;
}

export {getDate};
