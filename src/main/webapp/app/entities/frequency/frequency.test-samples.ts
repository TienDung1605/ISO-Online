import dayjs from 'dayjs/esm';

import { IFrequency, NewFrequency } from './frequency.model';

export const sampleWithRequiredData: IFrequency = {
  id: 8610,
};

export const sampleWithPartialData: IFrequency = {
  id: 15313,
  createdAt: dayjs('2025-01-24T02:13'),
  status: 'swiftly',
};

export const sampleWithFullData: IFrequency = {
  id: 30517,
  name: 'through or',
  createdAt: dayjs('2025-01-23T21:31'),
  updatedAt: dayjs('2025-01-23T23:43'),
  status: 'and',
  updateBy: 'prize intensely decamp',
};

export const sampleWithNewData: NewFrequency = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
