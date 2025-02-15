import dayjs from 'dayjs/esm';

import { ITitle, NewTitle } from './title.model';

export const sampleWithRequiredData: ITitle = {
  id: 32414,
};

export const sampleWithPartialData: ITitle = {
  id: 250,
  name: 'pfft file rightfully',
  createdAt: dayjs('2025-01-23T17:44'),
  dataType: 'when',
  field: 'justly worth ephemeris',
};

export const sampleWithFullData: ITitle = {
  id: 11021,
  name: 'finally steer tomorrow',
  source: 'down before',
  createdAt: dayjs('2025-01-23T06:11'),
  updatedAt: dayjs('2025-01-23T06:36'),
  dataType: 'overthrow piracy',
  updateBy: 'cosset proof-reader',
  field: 'kiddingly organization',
};

export const sampleWithNewData: NewTitle = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
