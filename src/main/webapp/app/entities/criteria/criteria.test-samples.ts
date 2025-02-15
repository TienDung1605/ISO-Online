import dayjs from 'dayjs/esm';

import { ICriteria, NewCriteria } from './criteria.model';

export const sampleWithRequiredData: ICriteria = {
  id: 3958,
};

export const sampleWithPartialData: ICriteria = {
  id: 8169,
  createdAt: dayjs('2025-01-24T03:42'),
  updatedAt: dayjs('2025-01-23T22:38'),
  updateBy: 'urge',
};

export const sampleWithFullData: ICriteria = {
  id: 14386,
  name: 'openly in-joke',
  criterialGroupId: 'boo phony whether',
  status: 'who electric',
  createdAt: dayjs('2025-01-23T06:16'),
  updatedAt: dayjs('2025-01-23T05:56'),
  updateBy: 'which swoop',
};

export const sampleWithNewData: NewCriteria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
