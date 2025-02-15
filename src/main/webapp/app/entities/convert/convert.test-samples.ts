import dayjs from 'dayjs/esm';

import { IConvert, NewConvert } from './convert.model';

export const sampleWithRequiredData: IConvert = {
  id: 2155,
};

export const sampleWithPartialData: IConvert = {
  id: 29556,
  updatedAt: dayjs('2025-01-23T18:24'),
  score: 27006,
};

export const sampleWithFullData: IConvert = {
  id: 11487,
  name: 'vice tidy well-to-do',
  type: 'familiar grizzled',
  mark: 'acclimatise happily travel',
  createdAt: dayjs('2025-01-24T00:02'),
  updatedAt: dayjs('2025-01-23T15:29'),
  updateBy: 'irritably snappy',
  score: 26957,
  count: 30866,
};

export const sampleWithNewData: NewConvert = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
