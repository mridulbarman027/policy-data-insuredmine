import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const toBase64 = (value: string) => {
  return Buffer.from(value).toString('base64');
};

export const getCurrentUTC = () => {
  return dayjs().utc().toDate();
};

export const getUtcDate = (date_string: string) => {
  return dayjs(date_string).utc().toDate();
};
