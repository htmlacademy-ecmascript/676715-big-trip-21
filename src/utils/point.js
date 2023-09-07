import dayjs from 'dayjs';

// временно закомментировано
// const MSEC_IN_SEC = 1000;
// const SEC_IN_MIN = 60;
// const MIN_IN_HOUR = 60;
// const HOUR_IN_DAY = 24;
// const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
// const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

function formatStringToDateTime(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

function formatStringToDateTime2(date) {
  return dayjs(date).format('YY/MM/DD HH:mm');
}

function formatStringToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToTime(date) {
  return dayjs(date).format('HH:mm');
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo);
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

export {formatStringToDateTime, formatStringToDateTime2, formatStringToShortDate, formatStringToTime, isPointFuture, isPointPresent, isPointPast};
