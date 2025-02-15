import dayjs from 'dayjs/esm';

import { IReportType, NewReportType } from './report-type.model';

export const sampleWithRequiredData: IReportType = {
  id: 22149,
};

export const sampleWithPartialData: IReportType = {
  id: 26966,
  name: 'resolve under afore',
  createdAt: dayjs('2025-01-23T12:37'),
  updatedAt: dayjs('2025-01-23T14:11'),
  updateBy: 'yet because ikebana',
};

export const sampleWithFullData: IReportType = {
  id: 5673,
  code: 'evenly hmph',
  name: 'commonly duh',
  status: 'mmm aged circa',
  createdAt: dayjs('2025-01-23T21:45'),
  updatedAt: dayjs('2025-01-23T09:56'),
  updateBy: 'striking another gah',
};

export const sampleWithNewData: NewReportType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
